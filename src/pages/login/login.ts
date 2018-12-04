import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';
import { Email } from '../../providers/auth/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  loginError = false;
  errorMsg: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authService: AuthProvider,
              private formBuilder: FormBuilder) {

                this.loginForm = this.formBuilder.group({
                  email: ['', Validators.required],
                  password: ['', Validators.required]
                });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    
  }

  get f() { return this.loginForm.controls; }

  login(): void {

    const email: Email = {email: this.f.email.value, password: this.f.password.value};
    this.authService.login(email).subscribe(
      userExists => {
        this.loginError = false;
        this.errorMsg = null;
        this.navCtrl.push(HomePage, {});
      },
      error => {
        this.errorMsg = error;
        this.loginError = true;
      }
      );
    
  }

}
