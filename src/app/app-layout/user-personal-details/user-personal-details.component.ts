import { AuthService } from './../../shared/services/auth.services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-personal-details',
  templateUrl: './user-personal-details.component.html',
  styleUrls: ['./user-personal-details.component.scss']
})
export class  UserPersonalDetailsComponent implements OnInit {

  userDetails;
  profilePicture;
  
  constructor(
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.getUserInfo(); 
    this.profilePicture = this.authService.profilePicture;
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
  updateUserProfilePicture(files:FileList){
    let fileItem = files.item(0);
    this.authService.updateProfilePhoto(fileItem)
      .then(
        ()=>{
          this.authService.getProfilePhoto()
        }
      )
  }

}