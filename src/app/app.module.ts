import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthService } from './shared/services/auth.services';
import { MsgService } from './shared/services/message.services';
import { WelcomeUserComponent } from './auth/welcome-user/welcome-user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpModule } from '@angular/http';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { HeaderComponent } from './shared/component/header/header.component';
import { SidebarComponent } from './shared/component/sidebar/sidebar.component';
import { FooterComponent } from './shared/component/footer/footer.component';
import { AuthGuard } from './shared/guard/auth-guard.service';
import { UserManagementComponent } from './app-layout/user-management/user-management.component';
import { ClassroomComponent } from './app-layout/classroom/classroom.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    WelcomeUserComponent,
    NotFoundComponent,
    AppLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    UserManagementComponent,
    ClassroomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthService,
    MsgService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
