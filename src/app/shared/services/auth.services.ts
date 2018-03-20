import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { MsgService } from './message.services';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService{
    userActivationStatus : boolean = false;
    database = firebase.database();
    userAdminPriviledge : boolean = false;
    private userDisplayName : string = '';

    constructor(private msgService:MsgService,private http: Http){}
    
    registerUser(email:string,password:string){
        return firebase.auth().createUserWithEmailAndPassword(email,password)
            .catch((error)=>{
                throw this.msgService.registrationIssues(error["code"]);
            });
    }
    
    processRegistration(email:string,password:string,displayname:string){
        this.signinInitializer(email,password).then(
            (response)=>{
                this.createUserAsViewer(email,displayname);            }
        )
    }
    signinInitializer(email:string,password:string){
        return firebase.auth().signInWithEmailAndPassword(email,password);
    }
    
    createUserAsViewer(email,displayName){
        const user = {
            email : email,
            displayName : displayName,
            activated : false,
            role:"Editor"
        };
        const uid = firebase.auth().currentUser.uid;
        this.database.ref('users/' + uid).set(user);
        
    }
    
    
    loginUser(email:string,password:string){
        return this.signinInitializer(email,password)
            .catch((response)=>{
                throw this.msgService.userCredentialIssue();
            });
    }
    
    getUserInfo(){
        const userId = firebase.auth().currentUser.uid;
        return firebase.database().ref('/users/' + userId).once('value');
    }
    
    setUserInfo(userData){
        this.setUserAdminPriviledge(userData.role);
        this.userDisplayName = userData.displayName;
    }

    private setUserAdminPriviledge(role){
        if(role=="SupremeLeader")
            this.userAdminPriviledge = true;
    }

    getUserAdminPriviledge() : boolean{
        return this.userAdminPriviledge;
    }

    getUserDisplayName(){
        return this.userDisplayName;
    }

    checkUserActivationStatus(userData){
        this.userActivationStatus = userData.activated;
        return userData.activated;
    }   
    
    getAllUsers(){
        return firebase.database().ref('/users').once('value');
    }
    activateUserStatus(uid){
        const updateData = {activated:true};
        const fb = this.database.ref();

        return fb.child('users/'+uid).update(updateData);
        //return firebase.database().ref('/users/'+uid).set({activated:true});
    }
    
    
    
    
    
    getAllClassrooms(){
        return this.database.ref('/classroomNames').once('value');
    }
    createNewClassroom(classroom_name:string){
        const classroomData = {
            name:classroom_name,
        };
        return this.database.ref('/classroomNames/'+classroom_name).set(classroomData);
    }
    subscribeClassroom(classroom){
        const classroomData = {classroom:classroom};
        const fb = this.database.ref();
        const userId = firebase.auth().currentUser.uid;

        return fb.child('users/'+userId).update(classroomData);
    }
    createClassroomSnippet(classroomName,snippet){
        return this.database.ref('classroomSnippets/'+classroomName).push().set(snippet);
    }
    loadClassroomSpecificSnippets(classroomName){
        return this.database.ref('classroomSnippets/'+classroomName).once('value');
    }
    updateSnippetFromClassroom(classroomName,snippetId,snippet){
        return this.database.ref('classroomSnippets/'+classroomName+'/'+snippetId).set(snippet);
    }
    removeSnippetFromClassroom(classroomName,snippetId){
        return this.database.ref('classroomSnippets/'+classroomName+'/'+snippetId).remove();
    }



    getUserspecificSnippets(){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref('privateKeep/'+uid).once('value');
    }
    createPrivateSnippet(snippet){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref('privateKeep/'+uid).push().set(snippet);
    }
    updatePrivateSnippet(snippetId,snippet){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref('privateKeep/'+uid+'/'+snippetId).set(snippet);
    }
    removePrivateSnippet(snippetId){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref('privateKeep/'+uid+'/'+snippetId).remove();
    }






    postSnippetAsSuggestion(classroomName,snippet){
        const publisher =this.getUserDisplayName();
        const importantSnippetInfo = {
            publisher:publisher,
            time:firebase.database.ServerValue.TIMESTAMP
        }
        snippet = Object.assign(snippet,importantSnippetInfo);
        return this.database.ref('classroomSuggestions/'+classroomName).push().set(snippet);
    }
    retrieveClassroomSpecificSnippets(classroomName){
        return this.database.ref('classroomSuggestions/'+classroomName).once("value")
    }
}