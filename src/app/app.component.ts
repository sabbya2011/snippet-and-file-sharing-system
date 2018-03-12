import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(){
    firebase.initializeApp({
      apiKey: "AIzaSyC1EjOboryW5ztOgVWn2xN0t70FoOce0tM",
      authDomain: "http-ang-1c4aa.firebaseapp.com",
      databaseURL: "https://http-ang-1c4aa.firebaseio.com/"
    });
  }
}
