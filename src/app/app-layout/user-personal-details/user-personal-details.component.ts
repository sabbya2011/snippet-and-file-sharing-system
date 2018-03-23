import { AuthService } from './../../shared/services/auth.services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-personal-details',
  templateUrl: './user-personal-details.component.html',
  styleUrls: ['./user-personal-details.component.css']
})
export class  UserPersonalDetailsComponent implements OnInit {

  userDetails;
  
  constructor(
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.getUserInfo();  
  }

  getUserInfo(){
    this.userDetails = this.authService.userDetails;
  }

  updateUserDetails(htmlInputTag:HTMLInputElement,userProps){
    this.authService.updateUserProperties(htmlInputTag.value,userProps)
      .then(()=>{
        console.log("User Property is updated");
        this.authService.updateUserInfo()
          .then(
            ()=>{
              this.getUserInfo();
            }
          )
      })
  }

}