import { AuthService } from './../../services/auth.services';
import { MsgService } from '../../services/message.services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userAccessibility : boolean = false;
  profilePicture;

  constructor(
    private router:Router,
    private authService:AuthService,
    private msgService:MsgService,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit() {
    this.userAccessibility = this.authService.getUserAdminPriviledge();
    this.profilePicture = this.authService.profilePicture;
  }
  
  logoutUser(){
    this.authService.logoutUser()
      .then(
        (res)=>{
          if(res==true){
            this.router.navigate(["welcome-user","login"]);
          }else{
            this.showSnackBar(this.msgService.logoutError())
          }
        }
      )
  }
  showSnackBar(msg){
    this.snackBar.open(msg,"",{
      duration:2000
    });
  }  

}
