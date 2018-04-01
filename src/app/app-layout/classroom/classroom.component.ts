import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.services';


@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit {
  userAccessibility : boolean = false;
  activeSnippetId : string;
  updateSnippetFlag : boolean = false;
  allClassroomData : any[] = [];
  snippetList : any[] = [];
  sameClassroomExists : boolean = false;
  userClassroom : string;

  @ViewChild('f_update_snippet') updateSnippetForm : NgForm;

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.userAccessibility = this.authService.getUserAdminPriviledge();
    this.createClassroomList();
    this.getUserClassroom()
      .then(
        ()=>{
          this.loadListofSnippets();
        }
      )
  }

  getClassroomSubscriptionInfoofUser(){
    return this.userClassroom?true:false;
  }
  
  checkExistingClassroom(classroom){
    return this.userClassroom==classroom?true:false;
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
        (res)=>{
          console.log("user has subscribed toclassroom "+classroomName);
          this.userClassroom = classroomName;
          this.loadListofSnippets();
        }
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
    }
  }

  populateUpdateSnippetForm(snippet){
    this.updateSnippetFlag = true;
    this.updateSnippetForm.form.patchValue(
      {snippet_name:snippet.header,
        snippet_body : snippet.body
      }
    );
    this.activeSnippetId = snippet.snippetId;
  }

  updateSnippet(form:NgForm){
    if(this.activeSnippetId){
      const snippet = {
        header:form.value.snippet_name,
        body:form.value.snippet_body
      };
      this.authService.updateSnippetFromClassroom(this.userClassroom,this.activeSnippetId,snippet)
        .then(
          ()=>{
            this.activeSnippetId = "";
            this.loadListofSnippets();             
          }
        )
    }
  }
  deleteSnippet(snippet){
    this.authService.removeSnippetFromClassroom(this.userClassroom,snippet.snippetId)
      .then(
        ()=>{
          this.loadListofSnippets();
        }
      )
  }
}
