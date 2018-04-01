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
    formInvalid(){
        return "Please provide all inputs correctly";
    }
    userCredentialIssue(){
        return "Please Provide Valid Credentials to Login";
    }
    validMail(){
        return "Not a valid email";
    }
    validUserName(){
        return "Username length in between 6 to 10";
    }
    validPassword(){
        return "Password length in between 6 to 10";
    }
    validConfirmPassword(){
        return "Password is different from Confirm password";
    }
    needValue(){
        return "You must enter a value";
    }
}