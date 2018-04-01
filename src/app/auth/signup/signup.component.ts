import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.services';
import { MsgService } from '../../shared/services/message.services';
import {FormControl, Validators, NgForm} from '@angular/forms';

import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  username = new FormControl('', 
    [Validators.required,this.manageLengthofInputs.bind(this)]);
  email = new FormControl('', 
    [Validators.required, Validators.email]);
  password = new FormControl('', 
    [Validators.required,this.manageLengthofInputs.bind(this)]);
  confirm_password = new FormControl('', 
    [Validators.required,this.checkConfirmPassword.bind(this)]);

  constructor(private authService : AuthService,
  private msgService : MsgService,
  private snackBar:MatSnackBar) { }

  ngOnInit() {
  }

  manageLengthofInputs(control:FormControl):{[data:string]:boolean}{
    const inputLength = control.value.length;
    console.log(control.touched+ control.value)
    if((inputLength<6 || inputLength > 10)&&(control.touched)){
      return {invalid:true};
    }else{
      return null;
    }
  }

  checkConfirmPassword(control:FormControl):{[data:string]:boolean}{
    
    if((control.value!=this.password.value)&&(control.touched)){
      return {invalid:true};
    }else{
      return null;
    }
  }

  getErrorMessage(form_control) {
    if(form_control=="email"){
      return this.email.hasError('required') ? this.msgService.needValue() :
        this.email.hasError('email') ? this.msgService.validMail() :
            '';
    }else if(form_control=="username"){
      return this.username.hasError('required') ? this.msgService.needValue() :
        this.username.valid == false ? this.msgService.validUserName() :
            '';
    }else if(form_control=="password"){
      return this.password.hasError('required') ? this.msgService.needValue() :
        this.password.valid == false ? this.msgService.validPassword() :
            '';
    }else if(form_control=="confirm_password"){
      return this.confirm_password.hasError('required') ? this.msgService.needValue() :
        this.confirm_password.valid == false ? this.msgService.validConfirmPassword() :
            '';
    }
  }
  onSignUp(ngform:NgForm){
    const userName = this.username.value;
    const email = this.email.value;
    const password = this.password.value;
    const confirm_password = this.confirm_password.value;
    if(ngform.valid){
      this.onSignUpRequestToServer(userName,email,password);
    }else{
      const error = this.msgService.formInvalid();
      console.log(error);
      this.createSnackBarAlert(error);
    }
  }
  onSignUpRequestToServer(userName:string,email:string,password:string){
    this.authService.registerUser(email,password)
      .then(
        (response)=>{
          const res = this.msgService.registrationSuccess();
          console.log(res);
          this.authService.processRegistration(email,password,userName);
          this.createSnackBarAlert(res);
        },
        (error)=>{
          console.log(error);
          this.createSnackBarAlert(error);
        }
      );
  }
  createSnackBarAlert(msg){
    this.snackBar.open(msg,"",{
      duration:2000
    });
  }
}
