import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.services';

@Component({
  selector: 'app-suggestion-box',
  templateUrl: './suggestion-box.component.html',
  styleUrls: ['./suggestion-box.component.css']
})
export class SuggestionBoxComponent implements OnInit {
  snippetList : any[] = [];
  userAccessibility : boolean = false;
  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.userAccessibility = this.authService.getUserAdminPriviledge();
    this.loadAllSnippets();
  }
  addZero(number){
    return number<10?'0'+number:number.toString();
  }
  evaluateTime(time){
    if(time){
      const hour = this.addZero(time.getHours());
      const minute = this.addZero(time.getMinutes());
      return hour+':'+minute;
    }else{
      return '';
    }
  }

  createSnippet(form:NgForm){
    const snippet = {
      header:form.value.snippet_name,
      body:form.value.snippet_body
    };   
    this.authService.getUserInfo()
      .then(
        (snapshot)=>{
          snapshot = snapshot.val();
          const classroom = snapshot.classroom;
          this.authService.postSnippetAsSuggestion(classroom,snippet)
            .then(
              ()=>{
                
                this.loadAllSnippets();
              }
            )
        }
      )
  }
  loadAllSnippets(){
    this.authService.getUserInfo()
    .then(
      (snapshot)=>{
        snapshot = snapshot.val();
        const classroom = snapshot.classroom;
        this.authService.retrieveClassroomSpecificSnippets(classroom)
          .then(
            (res)=>{
              this.createSnippetArray(res.val());
            }
          )
      }
    )
  }

  createSnippetArray(snippets){
    this.snippetList = [];
    if(snippets){
      Object.keys(snippets).forEach(
        (key)=>{
          const snippet = snippets[key];
          this.snippetList.push(snippet);
        }
      );
    }
  }

  addToClassroomSnippet(header,body){
    const snippet = {
      header:header,
      body:body
    }; 
    this.authService.getUserInfo()
      .then((res)=>{
        res = res.val();
        const userClassroom = res["classroom"];
        this.authService.createClassroomSnippet(userClassroom,snippet)
          .then(
            ()=>{
              this.loadAllSnippets();             
            }
          )
      }
    );
  }
}
