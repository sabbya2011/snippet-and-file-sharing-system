import { AuthService } from './../../services/auth.services';
import { MsgService } from '../../services/message.services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  profilePicture;

  constructor(
    private router:Router,
    private authService:AuthService,
    private msgService:MsgService,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit() {
    this.profilePicture = this.authService.profilePicture;
  }
  goToManageUser(){
    this.router.navigate(["processed-login","user"]);
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
