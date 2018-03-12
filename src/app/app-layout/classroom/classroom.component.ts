import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.services';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {
  activeSnippetId : string;
  updateSnippetFlag : boolean = false;
  allClassroomData : any[] = [];
  snippetList : any[] = [];
  sameClassroomExists : boolean = false;
  userClassroom;
  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.createClassroomList();
    this.getUserClassroom()
      .then(
        ()=>{
          this.loadListofSnippets();
        }
      )
    
  }

  getUserClassroom(){
    return this.authService.getUserInfo()
      .then(
        (res)=>{
          res = res.val();
          this.userClassroom = res["classroom"];
         
        }
      )
  }

  createClassroomList(){
    this.authService.getAllClassrooms()
      .then(
        (res)=>{
          this.allClassroomData = [];
          res = res.val();
          if(res){
            Object.keys(res).forEach(
              (key)=>{
                const classroom = res[key];
                this.allClassroomData.push(classroom);
              }
            );
          }else{
            this.allClassroomData = [];
          }
        }
      )
  }

  flashSameClassroomMsg(){
    this.sameClassroomExists = true;
    setTimeout(()=>{
      this.sameClassroomExists = false;
    },3500);
  }

  onCreateForm(formName){
    this.authService.createNewClassroom(formName)
      .then((res)=>{
        this.createClassroomList();
      });
  }

  checkClassroomDuplicacy(data,formName){
    if(data==null){
      this.onCreateForm(formName);
    }else if(data.hasOwnProperty(formName)){
      this.flashSameClassroomMsg();
    }else{
      this.onCreateForm(formName);
    }
  }
  
  onValidateForm(form:NgForm){
    const formName = form.value.cls_name;
    this.authService.getAllClassrooms()
      .then(
        (res)=>{
          this.checkClassroomDuplicacy(res.val(),formName)
        }
      );
  }

  subscribeToClassroom(classroomName){
    this.authService.subscribeClassroom(classroomName)
      .then(
        (res)=>{console.log("user has subscribed toclassroom "+classroomName);}
      )
  }

  createSnippet(form:NgForm){
    const snippet = {
      header:form.value.snippet_name,
      body:form.value.snippet_body
    }; 
    this.getUserClassroom().then(
      ()=>{
        this.authService.createClassroomSnippet(this.userClassroom,snippet)
          .then(
            ()=>{
              this.loadListofSnippets();             
            }
          )
      }
    );
  }

  loadListofSnippets(){
    if(!this.userClassroom){
      this.snippetList = [];
    }
    this.authService.loadClassroomSpecificSnippets(this.userClassroom)
      .then(
        (snapshot)=>{
          this.populateSnippetArray(snapshot.val());
        }
      )
  }

  populateSnippetArray(snippets){
    this.snippetList = [];
    if(snippets){
      Object.keys(snippets).forEach(
        (key)=>{
          const snippet = Object.assign({snippetId:key},snippets[key]);
          this.snippetList.push(snippet);
        }
      );      
    }else{
      this.snippetList = [];
    }
  }

  populateUpdateSnippet(form:NgForm,snippet){
    this.updateSnippetFlag = true;
    form.value.snippet_name = snippet.header;
    form.value.snippet_body = snippet.body;
    this.activeSnippetId = snippet.snippetId;
  }

  updateSnippet(form:NgForm){
    const snippet = {
      header:form.value.snippet_name,
      body:form.value.snippet_body
    };
    this.getUserClassroom().then(
      ()=>{
        this.authService.updateSnippet(this.userClassroom,this.activeSnippetId,snippet)
          .then(
            ()=>{
              this.loadListofSnippets();             
            }
          )
      }
    );
  }
}
