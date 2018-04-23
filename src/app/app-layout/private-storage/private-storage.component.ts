import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.services';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-private-storage',
  templateUrl: './private-storage.component.html',
  styleUrls: ['./private-storage.component.scss']
})
export class PrivateStorageComponent implements OnInit {
  snippetList : any[] = [];
  activeSnippetId : string;
  activeFileName :string = '';
  activeOption = "";
  contentHeader = "Select From Action List";
  attach_file_details : File = null;
  onloadFileName : string = '';
  downloadFileOnEditFlag : boolean;
  editForm : FormGroup;


  constructor(
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.getUserPrivateSnippets();
    this.showAction("viewnotes");
    this.initializeEditForm();
  }

  existanceofAttachFile() : boolean{
    if(this.activeOption=="createnotes"){
      return (this.attach_file_details)?true:false;
    }
    else if(this.activeOption=="editnotes"){
      return this.activeFileName?true:(this.attach_file_details)?true:false;
    }
  }
  removeAttachedFile(){
    if(this.activeOption=="createnotes"){
      this.attach_file_details = null;
    }else if(this.activeOption=="editnotes"){
      this.activeFileName = "";
      this.attach_file_details = null;
      this.downloadFileOnEditFlag = false;
    }
  }

  initializeEditForm(){
    this.editForm = new FormGroup({
      'snippet_name': new FormControl(null),
      'snippet_body': new FormControl(null),
      'attachedfile':new FormControl(null)
    });
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

  attachAttachment(file:FileList,inputTag:HTMLInputElement){
    const fileItem = file.item(0);
    if(fileItem.type!="application/x-zip-compressed" || fileItem.size>15000000){
      this.attach_file_details = null;
      inputTag.value = "";
    }else{
      this.attach_file_details = file.item(0);
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

  showAction(status:string){
    this.activeOption = status;
    if(status=="viewnotes"){
      this.contentHeader = "All Private Keeps";
    }else if(status="createnotes"){
      this.contentHeader = "Create Keep";
    }else if(status="editnotes"){
      this.contentHeader = "Edit Keep";
    }
  }

  resetSnippetAttachFile(snippet){
    snippet.attachFileName = "";
    const pushKey = this.authService.findPushKey("privateKeep");
    this.authService.createPrivateSnippet(snippet,pushKey)
      .then(
        (res)=>{
          console.log("reverted");
          this.getUserPrivateSnippets();
        },
        ()=>{
          console.log("error");
        }
      )
  }

  publishAttachFile(snippet,pushKey){
    this.authService.attachFile(this.attach_file_details,"privateKeep",pushKey)
    .then(
      ()=>{
        this.resetSnippetDetails();
        console.log("success");
        this.getUserPrivateSnippets();
      },
      ()=>{
        console.log("error");
        this.resetSnippetAttachFile(snippet);
      }
    )
  }
  removeAttachFromBucket(pushKey,fileName){
    this.authService.removeAttachFile("privateKeep",pushKey,fileName)
    .then(
      ()=>{
        this.resetSnippetDetails();
        console.log("success");
        this.getUserPrivateSnippets();
      }
    )
  }

  createPrivateSnippet(form:NgForm){
    let attachFileName = "";
    if(this.attach_file_details){
      attachFileName = this.attach_file_details.name;
    }

    const snippet = {
      header:form.value.snippet_name,
      body:form.value.snippet_body,
      attachFileName:attachFileName
    };
    const pushKey = this.authService.findPushKey("privateKeep");
    this.authService.createPrivateSnippet(snippet,pushKey)
      .then(
        (res)=>{
          if(attachFileName){
            this.publishAttachFile(snippet,pushKey);
          }else{
            console.log("success");
            this.getUserPrivateSnippets();
          }
        },
        (error)=>{
          console.log("Private Keep "+error);
        }
      )
  }

  getUserPrivateSnippets(){
    this.authService.getUserspecificSnippets()
      .then(
        (snapshot)=>{
          this.populateSnippetList(snapshot.val())
        }
      )
  }

  populateSnippetList(snippets){
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
    this.showAction('editnotes');
    this.editForm.patchValue({
      snippet_name:snippet.header,
      snippet_body : snippet.body,
    });
    this.activeSnippetId = snippet.snippetId;
    this.onloadFileName = snippet.attachFileName;
    this.downloadFileOnEditFlag = true;
    this.activeFileName = snippet.attachFileName;
  }
  resetSnippetDetails(){
    this.activeSnippetId = "";
    this.activeFileName = "";
    this.attach_file_details = null;
    this.editForm.reset();
    this.showAction("viewnotes");
  }
  updateSnippet(){
    if(this.activeSnippetId){
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
      this.authService.updatePrivateSnippet(snippet,pushKey)
        .then(
          (res)=>{
            if(!this.checkEditDownload()){
              this.removeAttachFromBucket(pushKey,this.onloadFileName);
            }
            if(this.attach_file_details){
              this.publishAttachFile(snippet,pushKey);
            }
            else{
              this.resetSnippetDetails();
              console.log("success");
              this.getUserPrivateSnippets();
            }
          },
          (error)=>{
            console.log("Private Keep "+error);
          }
        )
    }
  }
  deleteSnippet(snippet){
    this.authService.removePrivateSnippet(snippet.snippetId)
      .then(
        ()=>{
          if(snippet.attachFileName){
            this.authService.removeAttachFile("privateKeep",snippet.snippetId,snippet.attachFileName);
          }
          this.getUserPrivateSnippets();
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
  downloadAttachedFile(snippet){
    const snippet_key = snippet.snippetId;
    const snippet_attach_file = snippet.attachFileName;
    this.authService.downloadAttachedFile("privateKeep",snippet_key,snippet_attach_file)
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

}
