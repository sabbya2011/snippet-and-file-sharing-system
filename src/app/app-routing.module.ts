
import { NgModule } from "@angular/core";
import { AppComponent } from './app.component';

import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from "./auth/signin/signin.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { WelcomeUserComponent } from "./auth/welcome-user/welcome-user.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { AppLayoutComponent } from "./app-layout/app-layout.component";
import { AuthGuard } from "./shared/guard/auth-guard.service";
import { UserManagementComponent } from "./app-layout/user-management/user-management.component";
import { ClassroomComponent } from "./app-layout/classroom/classroom.component";
import { AdminGuard } from "./shared/guard/admin-guard.service";
const appRoutes: Routes = [
    {
        path:'',
        redirectTo:'/welcome-user/login',
        pathMatch:'full'
    },
    {

        path:'welcome-user',
        component:WelcomeUserComponent,
        children:[
            {path:'login',component:SigninComponent},
            {path:'register',component:SignupComponent}
        ]
    },
    {
        path:'processed-login',
        component:AppLayoutComponent,
        canActivate:[AuthGuard],
        children:[
            {
                path:'user-management',
                component:UserManagementComponent,
                canActivate:[AdminGuard]
            },
            {path:'classroom',component:ClassroomComponent},
            {path:'',redirectTo:'classroom',pathMatch:'full'}
        ]
    },
    {
        path:'not-found',component:NotFoundComponent
    },
    {
        path:'**',redirectTo:'/not-found'
    }
   
]
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class AppRoutingModule{
}