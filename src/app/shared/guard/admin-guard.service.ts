import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminGuard implements CanActivate{
    constructor(private authService:AuthService,
        private router:Router){}
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        const adminPriviledge = this.authService.getUserAdminPriviledge();
        if(adminPriviledge){
            return true;
        }else{
            this.router.navigate(['welcome-user/login']);
            return false;
        }
    }
}