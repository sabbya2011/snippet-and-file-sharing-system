import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.services';


@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit {
  userAccessibility : boolean = false;
  activeSnippetId : string;
  onloadFileName : string;
  downloadFileOnEditFlag : boolean;
  allClassroomData : any[] = [];
  snippetList : any[] = [];
  sameClassroomExists : boolean = false;
  userClassroom : string;
  activeOption = "";
  contentHeader = "Select From Action List";
  attach_file_details : File = null;
  activeFileName :string = '';
  editForm : FormGroup;


  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.userAccessibility = this.authService.getUserAdminPriviledge();
    this.createClassroomList();
    this.initializeEditForm();
    this.getUserClassroom()
      .then(
        ()=>{
          this.loadListofSnippets();
        }
      )
    this.showAction("viewclassrooms");
  }

  initializeEditForm(){
    this.editForm = new FormGroup({
      'snippet_name': new FormControl(null),
      'snippet_body': new FormControl(null),
      'attachedfile':new FormControl(null)
    });
  }

  createUserClassroomId(){
    return {
      classroomId : this.userClassroom
    }
  }

  showNavigation(actionList:HTMLElement,keyRight:HTMLElement){
    actionList.style.display = 'flex';
    keyRight.style.display = 'none';
  }
  hideNavigation(actionList:HTMLElement,keyRight:HTMLElement){
    actionList.style.display = 'none';
    keyRight.style.display = 'block';
  }
  activeActionClass(status:string){
    return this.activeOption == status?"active-action-list":"";
  }
  showItemsBySelectedActionList(status:string){
    return this.activeOption == status?true:false;
  }
  showItemsBySelectedAnyActionList(status_first:string,status_second:string){
    return (this.activeOption == status_first || this.activeOption == status_second) ?true:false;
  }

  showAction(status:string){
    this.activeOption = status;
    if(status=="viewclassrooms"){
      this.contentHeader = "Classroom List";
    }else if(status=="creatematerials"){
      this.contentHeader = "Create Materials";
    }else if(status=="joinclassroom"){
      this.contentHeader = "Join Classroom";
    }else if(status=="editclassroomnote"){
      this.contentHeader = "Edit Material";
    }else if(status=="viewclassroomnote"){
      this.contentHeader = "View Material";
    }
  }
  checkSnippetFileAttached(flag){
    return (flag)?true:false;
  }
  getAttachFileName(){
    return (this.attach_file_details)?this.attach_file_details.name:"No Files Attached"; 
  }
  getAttachFileNameForEditing(){
    return this.activeFileName?this.activeFileName:this.getAttachFileName();
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
    form.setValue({cls_name:''});
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
  unSubscribeToClassroom(){
    this.authService.subscribeClassroom(null)
      .then(
        (res)=>{
          console.log("user has unsubscribed from any classroom");
          this.userClassroom = null;
          this.loadListofSnippets();
        }
      )
  }

  attachAttachment(file:FileList,inputTag:HTMLInputElement){
    const fileItem = file.item(0);
    if(fileItem.type!="application/x-zip-compressed" || fileItem.size>15000000){
      this.attach_file_details = null;
      inputTag.value = "";
    }else{
      this.attach_file_details = file.item(0);
    }
  }
  existanceofAttachFile() : boolean{
    if(this.activeOption=="createclassroomnote"){
      return (this.attach_file_details)?true:false;
    }else if(this.activeOption=="editclassroomnote"){
      return this.activeFileName?true:(this.attach_file_details)?true:false;
    }else if(this.activeOption=="viewclassroomnote"){
      return false;
    }
  }
  removeAttachedFile(){
    if(this.activeOption=="createclassroomnote"){
      this.attach_file_details = null;
    }else if(this.activeOption=="editclassroomnote"){
      this.activeFileName = "";
      this.attach_file_details = null;
      this.downloadFileOnEditFlag = false;
    }
  }
  downloadAttachedFile(snippet){
    const snippet_key = snippet.snippetId;
    const snippet_attach_file = snippet.attachFileName;
    const identifier = this.createUserClassroomId();
    this.authService.downloadAttachedFile("classroom",snippet_key,snippet_attach_file,identifier)
    .then(
      (dataurl)=>{
        var a = document.createElement("a");
        a.href = dataurl;
        a.setAttribute("download", snippet_attach_file);
        var b = document.createEvent("MouseEvents");
        b.initEvent("click", false, true);
        a.dispatchEvent(b);
        return false;
      }
    )
  }
  resetSnippetDetails(){
    this.activeSnippetId = "";
    this.activeFileName = "";
    this.attach_file_details = null;
    //this.editForm.reset();
    this.showAction("joinclassroom");
  }
  resetSnippetAttachFile(snippet){
    snippet.attachFileName = "";
    const identifier = this.createUserClassroomId();
    const pushKey = this.authService.findPushKey("classroom",identifier);
    this.authService.createClassroomSnippet(this.userClassroom,snippet,pushKey)
      .then(
        (res)=>{
          console.log("reverted");
          this.loadListofSnippets();
        },
        (error)=>{
          console.log("error "+error);
        }
      )
  }
  publishSnippet(snippet,pushKey,idenrifier = null){
    this.authService.attachFile(this.attach_file_details,"classroom",pushKey,idenrifier)
    .then(
      ()=>{
        this.resetSnippetDetails();
        console.log("success");
        this.loadListofSnippets();
      },
      ()=>{
        console.log("error");
        this.resetSnippetAttachFile(snippet);
      }
    )
  }
  createSnippet(form:NgForm){
    
      let attachFileName = "";
      if(this.attach_file_details){
        attachFileName = this.attach_file_details.name;
      }
  
      const snippet = {
        header:form.value.snippet_name,
        body:form.value.snippet_body,
        attachFileName:attachFileName
      };
      const idenrifier = {
        classroomId: this.userClassroom
      }
      const pushKey = this.authService.findPushKey("classroom",idenrifier);
      
      
      this.authService.createClassroomSnippet(this.userClassroom,snippet,pushKey)
        .then(
          (res)=>{
            if(attachFileName){
              this.publishSnippet(snippet,pushKey,idenrifier);
            }else{
              console.log("success");
              this.loadListofSnippets();             
            }
          },
          (error)=>{
            console.log("Classroom Snippet "+error);
          }
        )
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
    if(this.userAccessibility){
      this.showAction('editclassroomnote');
    }else{
      this.showAction('viewclassroomnote');
    }
    this.editForm.patchValue({
      snippet_name:snippet.header,
      snippet_body : snippet.body,
    });
    this.activeSnippetId = snippet.snippetId;
    this.onloadFileName = snippet.attachFileName;
    this.downloadFileOnEditFlag = true;
    this.activeFileName = snippet.attachFileName;
  }
  updateSnippet(){
    if(this.activeSnippetId && this.userAccessibility){
      let attachFileName = this.activeFileName;
      if(this.attach_file_details){
        attachFileName = this.attach_file_details.name;
      }
      const snippet = {
        header:this.editForm.get("snippet_name").value,
        body:this.editForm.get("snippet_body").value,
        attachFileName:attachFileName?attachFileName:null
      };
      
      const pushKey = this.activeSnippetId;
      this.authService.updateSnippetFromClassroom(this.userClassroom,pushKey,snippet)
        .then(
          (res)=>{
            if(this.onloadFileName && !this.downloadFileOnEditFlag){
              this.removeAttachFromBucket(pushKey,this.onloadFileName);
            }
            if(this.attach_file_details){
              this.publishAttachFile(snippet,pushKey);
            }
            else{
              this.resetSnippetDetails();
              console.log("success");
              this.loadListofSnippets();
            }
          },
          (error)=>{
            console.log("Classroom Snippet "+error);
          }
        )
    }
  }
  publishAttachFile(snippet,pushKey){
    const identifier = this.createUserClassroomId();
    this.authService.attachFile(this.attach_file_details,"classroom",pushKey,identifier)
    .then(
      ()=>{
        this.resetSnippetDetails();
        console.log("success");
        this.loadListofSnippets();
      },
      ()=>{
        console.log("error");
        this.resetSnippetAttachFile(snippet);
      }
    )
  }
  removeAttachFromBucket(pushKey,fileName){
    const identifier = this.createUserClassroomId();
    this.authService.removeAttachFile("classroom",pushKey,fileName,identifier)
    .then(
      ()=>{
        this.resetSnippetDetails();
        console.log("success");
        this.loadListofSnippets();
      }
    )
  }
  
  deleteSnippet(snippet){
    this.authService.removeSnippetFromClassroom(this.userClassroom,snippet.snippetId)
      .then(
        ()=>{
          if(snippet.attachFileName){
            const identifier = this.createUserClassroomId();
            this.authService.removeAttachFile("classroom",snippet.snippetId,snippet.attachFileName,identifier);
          }
          this.loadListofSnippets();
        }
      )
  }

  checkEditDownload(){
    return (this.onloadFileName && this.downloadFileOnEditFlag)?true:false;
  }
  downloadFileFromExpandedView(){
    const snippet = {
      snippetId : this.activeSnippetId,
      header:this.editForm.get("snippet_name").value,
      body:this.editForm.get("snippet_body").value,
      attachFileName:this.onloadFileName
    };
    this.downloadAttachedFile(snippet);
  }
}
