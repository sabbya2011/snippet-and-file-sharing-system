import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { MsgService } from './message.services';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService{
    userActivationStatus : boolean = false;
    database = firebase.database();

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
    updateSnippet(classroomName,snippetId,snippet){
        return this.database.ref('classroomSnippets/'+classroomName+'/'+snippetId).set(snippet);
    }
    removeSnippet(classroomName,snippetId){
        return this.database.ref('classroomSnippets/'+classroomName+'/'+snippetId).remove();
    }
}