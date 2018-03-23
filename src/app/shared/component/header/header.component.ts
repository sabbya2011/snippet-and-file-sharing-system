import { AuthService } from './../../services/auth.services';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  profilePicture;

  constructor(
    private router:Router,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.profilePicture = this.authService.profilePicture;
  }
  goToManageUser(){
    this.router.navigate(["processed-login","user"]);
  }
}
