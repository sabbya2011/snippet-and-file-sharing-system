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
  activeOption = "";
  contentHeader = "Select From Action List";
  constructor(
     
    private authService : AuthService) { }

  ngOnInit() {
    this.updateAllUserData();
    this.showUsers("pending");
  }

  showNavigation(actionList:HTMLElement,keyRight:HTMLElement){
    actionList.style.display = 'flex';
    keyRight.style.display = 'none';
  }
  hideNavigation(actionList:HTMLElement,keyRight:HTMLElement){
    actionList.style.display = 'none';
    keyRight.style.display = 'block';
  }

  getCurrentDateTime(){
    let dateTime = Date.now();
    return dateTime;
  }

  activeActionClass(status:string){
    return this.activeOption == status?"active-action-list":"";
  }
  showItemsBySelectedActionList(status:string){
    return this.activeOption == status?true:false;
  }

  showUsers(status:string){
    this.activeOption = status;
    if(status=="pending"){
      this.contentHeader = "Pending Users";
    }else if(status="activated"){
      this.contentHeader = "Active Users";
    }
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

  // filterUserTimeline(userData,dateTime){
  //   let userDataDateTime = new Date(userData.requestTime);
    
  //   let userDate = userDataDateTime.getDate();
  //   let userMonth = userDataDateTime.getMonth();
  //   let userYear = userDataDateTime.getFullYear();
    
  //   let currentDate = dateTime.getDate();
  //   let currentMonth = dateTime.getMonth();
  //   let currentYear = dateTime.getFullYear();

  //   if(currentYear==userYear){
  //     if(currentMonth==userMonth){
  //       if(currentDate==userDate){
  //         return "Today";
  //       }else{
  //         return "This Month";
  //       }
  //     }else{
  //       return "This Year";
  //     }
  //   }else{
  //     return "Old Records";
  //   }
     
  // }

  filterUsersList(){
    this.activeUsersData = [];
    this.pendingUsersData = [];
    if(this.userData){
      Object.keys(this.userData).forEach(
        (key)=>{
          const user = Object.assign({userId:key},this.userData[key]);
          const dateTime = this.getCurrentDateTime();
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
  deactivateUser(uid:string){
    this.authService.deactivateUserStatus(uid)
    .then((res)=>{
      this.updateAllUserData();
    });
  }
  deleteUser(uid:string){
    this.authService.deleteUserInfo(uid)
    .then((res)=>{
      this.updateAllUserData();
    });
  }
}
