import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.services';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-private-storage',
  templateUrl: './private-storage.component.html',
  styleUrls: ['./private-storage.component.scss']
})
export class PrivateStorageComponent implements OnInit {
  snippetList : any[] = [];
  activeSnippetId : string;
  @ViewChild('f_update_snippet') updateSnippetForm : NgForm;
  constructor(
    private authService : AuthService
  ) { }

  ngOnInit() {
    this.getUserPrivateSnippets();
  }

  createPrivateSnippet(form:NgForm){
    const snippet = {
      header:form.value.snippet_name,
      body:form.value.snippet_body
    };
    this.authService.createPrivateSnippet(snippet)
      .then(
        (res)=>{
          console.log("success");
          this.getUserPrivateSnippets();
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
    this.updateSnippetForm.setValue(
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
}
