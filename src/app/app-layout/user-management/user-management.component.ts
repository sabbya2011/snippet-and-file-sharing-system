import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.services';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  userData;
  activeUsersData:any[]=[];
  pendingUsersData:any[]=[];
  constructor(
     
    private authService : AuthService) { }

  ngOnInit() {
    this.updateAllUserData();
  }
  updateAllUserData(){
    this.authService.getAllUsers()
      .then(
        (userData)=>{
          this.userData = userData.val();
          this.filterUsersList();
        }
      )
  }
  filterUsersList(){
    this.activeUsersData = [];
    this.pendingUsersData = [];
    if(this.userData){
      Object.keys(this.userData).forEach(
        (key)=>{
          const user = Object.assign({userId:key},this.userData[key]);
          if(this.userData[key].activated){
            this.activeUsersData.push(user);
          }else{
            this.pendingUsersData.push(user);
          }
        }
      );
    }
  }
  getActiveUsersList(){
    return this.activeUsersData;
  }
  getPendingUsersList(){
    return this.pendingUsersData;
  }
  activateUser(uid:string){
    this.authService.activateUserStatus(uid)
    .then((res)=>{
      this.updateAllUserData();
    });
  }
}
