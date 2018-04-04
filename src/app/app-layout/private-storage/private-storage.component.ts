import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.services';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import 'rxjs/Rx';

@Component({
  selector: 'app-private-storage',
  templateUrl: './private-storage.component.html',
  styleUrls: ['./private-storage.component.scss']
})
export class PrivateStorageComponent implements OnInit {
  snippetList : any[] = [];
  activeSnippetId : string;
  activeOption = "";
  contentHeader = "Select From Action List";
  attach_file_details : File;
  @ViewChild('f_update_snippet') updateSnippetForm : NgForm;
  constructor(
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.getUserPrivateSnippets();
    this.showAction("viewnotes");
  }

  checkSnippetFileAttached(flag){
    return (flag)?true:false;
  }

  getAttachFileName(){
    return (this.attach_file_details)?this.attach_file_details.name:"No Files Attached"; 
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

  publishSnippet(snippet,pushKey){
    this.authService.attachFile(this.attach_file_details,"privateKeep",pushKey)
    .then(
      ()=>{
        console.log("success");
        this.getUserPrivateSnippets();
      },
      ()=>{
        console.log("error");
        this.resetSnippetAttachFile(snippet);
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
            this.publishSnippet(snippet,pushKey);
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
    this.updateSnippetForm.form.patchValue(
      {
        snippet_name:snippet.header,
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
      this.authService.updatePrivateSnippet(this.activeSnippetId,snippet)
        .then(
          ()=>{
            this.activeSnippetId = "";
            this.getUserPrivateSnippets();             
          }
        )
    }
  }
  deleteSnippet(snippet){
    this.authService.removePrivateSnippet(snippet.snippetId)
      .then(
        ()=>{
          this.getUserPrivateSnippets();
        }
      )
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
