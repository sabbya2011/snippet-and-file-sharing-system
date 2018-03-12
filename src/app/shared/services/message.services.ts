export class MsgService {
    registrationIssues(error_msg){
        if(error_msg=="auth/email-already-in-use"){
            return "This Account is already in use";
        }else{
            return "Server issue! Sorry for the disturbance";
        }
    }
    registrationSuccess(){
        return "Registration process has been initiated. Please wait for Administrator approval";
    }
    registrationPasswordMismatch(){
        return "Please enter Confirm Password properly";
    }
    userCredentialIssue(){
        return "please provide Valid Credential to login";
    }
}