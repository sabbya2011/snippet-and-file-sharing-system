import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.services';
import { MsgService } from '../../shared/services/message.services';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    flagActive : boolean = false;

    constructor(private authService : AuthService,
      private msgService : MsgService,
      private router :Router ) { }
  
    ngOnInit() {
    }
    onLogin(formInfo:NgForm){
      const email = formInfo.value.email;
      const password = formInfo.value.password;
      this.authService.loginUser(email,password)
        .then(
          (res)=>{
            this.authService.getUserInfo()
            .then((snapshot) => {
                this.checkUserValidity(snapshot.val());
            });  
          },
          (error)=>{console.log(error)}
        );
           
    }
    checkUserValidity(userData){
      if(this.authService.checkUserActivationStatus(userData)){
        this.authService.setUserAdminPriviledge(userData);
        this.router.navigate(["/processed-login"]);
      }else{
        this.flagActive = true;
        setTimeout(()=>{
          this.flagActive = false;
        },5000);
      }
    }    
}
