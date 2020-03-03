import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// import { AlertService, AuthenticationService } from '../_services/index';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserService } from '../_services/index';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: []
})

export class LoginComponent{
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  login() {
    this.loading = true;
    this.authService.login(this.model.userid, this.model.password).subscribe(res => {
      console.log(res);
      if (res['errorcode']==0) {
        var user = {"userid": this.model.userid, "password": this.model.password, "approle": res['approle']};
        this.userService.setCurrentuser(user);

        localStorage.setItem('currentUser', JSON.stringify(user));
        if (res['approle']=="admin") {
          this.router.navigate(['users']);
        } else {
          this.router.navigate([res['approle']]);
        }
      } else if (res['errorcode']==402){
        // Enroll user!
        console.log("enroll user");
        alert(res['errormessage'] + "\n \nPlease make sure that an administrater has created an account for you and that you've registered first.");
        this.router.navigate(['register']);
      } else {
        alert("Either you need to be registered first before you are able to log in \n \n -OR- \n \n you should double check the spelling of the userid and password.");
      }
    }, error => {
      console.log(error);
      alert("Login failed.");
      this.loading = false;
    });
  }
}