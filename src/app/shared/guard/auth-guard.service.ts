import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.services";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService:AuthService){}
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        return this.authService.userActivationStatus;
    }
}