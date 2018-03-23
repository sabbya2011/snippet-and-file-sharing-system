import { AuthService } from './../../services/auth.services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userAccessibility : boolean = false;
  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.userAccessibility = this.authService.getUserAdminPriviledge();
  }

}
