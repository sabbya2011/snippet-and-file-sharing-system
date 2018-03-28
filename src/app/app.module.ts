import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AdminGuard } from './shared/guard/admin-guard.service';
import { PrivateStorageComponent } from './app-layout/private-storage/private-storage.component';
import { SuggestionBoxComponent } from './app-layout/classroom/suggestion-box/suggestion-box.component';
import { UserPersonalDetailsComponent } from './app-layout/user-personal-details/user-personal-details.component';



import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

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
    ClassroomComponent,
    PrivateStorageComponent,
    SuggestionBoxComponent,
    UserPersonalDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,

    
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    AuthService,
    MsgService,
    AuthGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
