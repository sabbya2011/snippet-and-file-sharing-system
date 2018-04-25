import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { MsgService } from './message.services';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService{
    userDetails;
    profilePicture={url:""};
    userActivationStatus : boolean = false;
    database = firebase.database();
    userAdminPriviledge : boolean = false;
    private userDisplayName : string = '';
    pushKey:string;

    constructor(private msgService:MsgService,private http: Http){}
    

    getFirebaseDate(){
        return firebase.database.ServerValue.TIMESTAMP;
    }

    registerUser(email:string,password:string){
        return firebase.auth().createUserWithEmailAndPassword(email,password)
            .catch((error)=>{
                throw this.msgService.registrationIssues(error["code"]);
            });
    }
    
    processRegistration(email:string,password:string,displayname:string){
        return this.signinInitializer(email,password).then(
            (response)=>{
                return this.createUserAsViewer(email,displayname);            }
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
            role:"Editor",
            requestTime:this.getFirebaseDate()
        };
        const uid = firebase.auth().currentUser.uid;
        this.database.ref('users/' + uid).set(user);
        return true;
    }
    
    forgetPasswordUser(email:string){
        return firebase.auth().sendPasswordResetEmail(email)
    }

    loginUser(email:string,password:string){
        return this.signinInitializer(email,password)
            .catch((response)=>{
                throw this.msgService.userCredentialIssue();
            });
    }

    clearAuth(){
        this.userActivationStatus = false;
        this.userDetails = "";
        this.userAdminPriviledge = false;
    }

    logoutUser(){
        return firebase.auth().signOut()
            .then(
                (res)=>{
                    this.clearAuth();
                    return true;
                },
                (error)=>{
                    return false;
                }

            );
    }
    
    getUserInfo(){
        const userId = firebase.auth().currentUser.uid;
        return firebase.database().ref('/users/' + userId).once('value');
    }
    
    
    setUserAdminPriviledge(role){
        if(role=="SupremeLeader")
            this.userAdminPriviledge = true;
    }

    getUserAdminPriviledge() : boolean{
        return this.userAdminPriviledge;
    }

    getUserDisplayName(){
        return this.userDetails.displayName;
    }

    checkUserActivationStatus(userData){
        this.userActivationStatus = userData.activated;
        return userData.activated;
    }   
    
    getAllUsers(){
        return firebase.database().ref('/users').once('value');
    }
    activateUserStatus(uid){
        const updateData = {
            activated:true,
            approvedTime:this.getFirebaseDate()
        };
        const fb = this.database.ref();
        return fb.child('users/'+uid).update(updateData);
        
    }
    deactivateUserStatus(uid){
        const updateData = {activated:false};
        const fb = this.database.ref();
        return fb.child('users/'+uid).update(updateData);
    }
    deleteUserInfo(uid){
        const fb = this.database.ref();
        const promise = fb.child('privateKeep/'+uid).remove();
        return promise.then((res)=>{
            return fb.child('users/'+uid).remove();
        });
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
    createClassroomSnippet(classroomName,snippet,pushKey){
        return this.database.ref('classroomSnippets/'+classroomName).child(pushKey).set(snippet);
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

    findPushKey(type,identifierObj=null){
        if(type=="privateKeep"){
            const uid = firebase.auth().currentUser.uid;
            this.pushKey = this.database.ref('privateKeep/'+uid).push().key;
            return this.pushKey;
        }else if(type=="classroom"){
            this.pushKey = this.database.ref('classroomSnippets/'+identifierObj.classroomId).push().key;
            return this.pushKey;
        }
    }
    getUserspecificSnippets(){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref('privateKeep/'+uid).once('value');
    }
    createPrivateSnippet(snippet,pushKey){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref('privateKeep/'+uid).child(pushKey).set(snippet);
         
    }
    updatePrivateSnippet(snippet,snippetId){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref().child('privateKeep/'+uid+'/'+snippetId).set(snippet);
    }
    removePrivateSnippet(snippetId){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref().child('privateKeep/'+uid+'/'+snippetId).remove();
    }






    postSnippetAsSuggestion(classroomName,snippet){
        const publisher =this.getUserDisplayName();
        const importantSnippetInfo = {
            publisher:publisher,
            time:this.getFirebaseDate()
        }
        snippet = Object.assign(snippet,importantSnippetInfo);
        return this.database.ref('classroomSuggestions/'+classroomName).push().set(snippet);
    }
    retrieveClassroomSpecificSnippets(classroomName){
        return this.database.ref('classroomSuggestions/'+classroomName).once("value")
    }
    removeAllSuggestions(classroomName){
        return this.database.ref('classroomSuggestions/'+classroomName).remove();
    }



    updateUserProperties(value,key){
        const uid = firebase.auth().currentUser.uid;
        return this.database.ref('users/'+uid+'/'+key).set(value);
    }
    updateUserInfo(){
        return this.getUserInfo().then((res)=>{
            res = res.val();
            this.userDetails = res;
            return this.userDetails;
        })
    }
    updateProfilePhoto(file:File){
        const fileExt = file.name.split(".")[1];
        let metadata;
        if(fileExt=="jpg"){
            metadata = {
                contentType: 'image/jpeg',
            };
        }else if(fileExt=="png"){
            metadata = {
                contentType: 'image/png',
            };
        }
        const uid = firebase.auth().currentUser.uid;
        const storageref = firebase.storage().ref().child('ProfilePicture/'+uid+'/profilePhoto');
        return storageref.put(file,metadata);
    }
    getProfilePhoto(){
        const uid = firebase.auth().currentUser.uid;
        const storageref = firebase.storage().ref().child('ProfilePicture/'+uid+'/profilePhoto');
        return storageref.getDownloadURL().then((url)=>{
            this.profilePicture.url = url;
          }).catch((error)=>{
            this.profilePicture.url = '';
          });
    }


    attachFile(file:File,fileAddress,pushKey,identifierObj=null){

        const metadata = {
            contentType: file.type
        };
        let address = "";
        if(fileAddress=="privateKeep"){
            const uid = firebase.auth().currentUser.uid;
            address = `PrivateKeep/${uid}/${pushKey}/${file.name}`;
        }else if(fileAddress=="classroom"){
            address = `classroomSnippets/${identifierObj.classroomId}/${pushKey}/${file.name}`;
        }
        const storageref = firebase.storage().ref().child(address);
        return storageref.put(file,metadata);
    }

    removeAttachFile(fileAddress,pushKey,fileName,identifier=null){
        let address = "";
        if(fileAddress=="privateKeep"){
            const uid = firebase.auth().currentUser.uid;
            address = `PrivateKeep/${uid}/${pushKey}/${fileName}`;
        }else if(fileAddress=="classroom"){
            address = `classroomSnippets/${identifier.classroomId}/${pushKey}/${fileName}`;
        }
        const storageref = firebase.storage().ref().child(address);
        return storageref.delete();
    }

    downloadAttachedFile(fileAddress,fileKey,fileName,identifier=null){
        const uid = firebase.auth().currentUser.uid;
        let address = "";
        if(fileAddress=="privateKeep"){
            address = `PrivateKeep/${uid}/${fileKey}/${fileName}`;
        }else if(fileAddress=="classroom"){
            address = `classroomSnippets/${identifier.classroomId}/${fileKey}/${fileName}`;
        }
        const storageref = firebase.storage().ref().child(address);
        return storageref.getDownloadURL();
    }
}