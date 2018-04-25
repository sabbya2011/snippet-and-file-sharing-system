import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.services';
import { MsgService } from '../../shared/services/message.services';
import { Router } from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

    forgetPasswordField : boolean = false;
    email = new FormControl('', [Validators.required, Validators.email]);
    password = new FormControl('', [Validators.required]);
    forgetemail = new FormControl('', [Validators.required, Validators.email]);
    constructor(private authService : AuthService,
      private msgService : MsgService,
      private router :Router,
      private snackBar : MatSnackBar ) { }
  
    enableForgetFlag(){
      this.forgetPasswordField = true;
    }
    disableForgetFlag(){
      this.forgetPasswordField = false;
    }
    getErrorMessage() {
      return this.email.hasError('required') ? this.msgService.needValue() :
          this.email.hasError('email') ? this.msgService.validMail() :
              '';
    }
    getForgetErrorMessage() {
      return this.forgetemail.hasError('required') ? this.msgService.needValue() :
          this.forgetemail.hasError('email') ? this.msgService.validMail() :
              '';
    }
    onForgetPassword(){
      this.authService.forgetPasswordUser(this.forgetemail.value)
        .then(()=>{
          const msg = this.msgService.passwordResetEmail();
          this.showSnackBar(msg);
        },
      ()=>{
        const msg = this.msgService.userDontExist();
        this.showSnackBar(msg);
      })
    }
    onLogin(){
      const email = this.email.value;
      const password = this.password.value;
      
      if(!this.email.valid || !this.password.valid){
        const error = this.msgService.userCredentialIssue();
        this.showSnackBar(error);
        return;
      }
      this.authService.loginUser(email,password)
        .then(
          (res)=>{
            this.authService.updateUserInfo()
            .then((userData) => {
                this.authService.getProfilePhoto();
                this.checkUserValidity(userData);
            });  
          },
          (error)=>{
            console.log(error);
            this.showSnackBar(error);
          }
        );
           
    }
    checkUserValidity(userData){
      if(this.authService.checkUserActivationStatus(userData)){
        this.authService.setUserAdminPriviledge(userData.role);
        this.router.navigate(["processed-login"]);
      }else{
       this.showSnackBar(this.msgService.loginBeingProcessed()); 
      }
    }
    showSnackBar(msg){
      this.snackBar.open(msg,"",{
        duration:2000
      });
    }    
}
