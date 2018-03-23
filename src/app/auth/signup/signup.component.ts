import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.services';
import { MsgService } from '../../shared/services/message.services';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService : AuthService,
  private msgService : MsgService) { }

  ngOnInit() {
  }
  onSignUp(formInfo:NgForm){
    const userName = formInfo.value.userName;
    const email = formInfo.value.email;
    const password = formInfo.value.password;
    const confirm_password = formInfo.value.confirm_password;
    if(password===confirm_password){
      this.onSignUpRequestToServer(userName,email,password);
    }else{
      console.log(this.msgService.registrationSuccess());
    }
  }
  onSignUpRequestToServer(userName:string,email:string,password:string){
    this.authService.registerUser(email,password)
      .then(
        (response)=>{
          console.log(this.msgService.registrationSuccess());
          this.authService.processRegistration(email,password,userName);
        },
        (error)=>{
          console.log(error);
        }
      );
  }
}
