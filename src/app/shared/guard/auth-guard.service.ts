import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "../services/auth.services";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService:AuthService,
        private router:Router){}
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        if(this.authService.userActivationStatus || 1){
            return true;
        }else{
            this.router.navigate(['welcome-user','login']);
            return false;
        }
    }
}