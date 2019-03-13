import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ValidatorProvider {

  constructor(public http: HttpClient) {
  
  }

  validateData(data){

    console.log(data);
    return new Promise((resolve, reject) => {
      if(data.title == undefined){
        return reject("title");
      }else if(data.description == undefined){
        return reject("description");
      }else if(data.contact == undefined){
        return reject("contact info");
      }else{
        return resolve("ok");
      }
    })

  }
  /** 
   * 
   *What a horrible way to validate. 
   * 
  */
  validateRegister(user){
    
    return new Promise((resolve, reject) => {
      if(user.username == undefined || user.username.length == 0){
        return reject("username");
      }else if(user.password == undefined || user.password.length < 5){
        return reject("password(min 5 char)");
      }else if(user.password2 == undefined ||user.password2.length < 5){
        return reject("the other password");
      }else if(user.fullname == undefined ||user.fullname.length == 0){
        return reject("fullname");
      }else if(user.email == undefined || user.email.length == 0){
        return reject("email");
      }else if(!this.checkPasswords(user.password, user.password2)){
        return reject("both passwords");
      }else if(!this.validateEmail(user.email)){
        return reject("email");
      }else{
        return resolve("done");
      }

    }); 
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
checkPasswords(pass1,pass2){
  if(pass1 == pass2 && pass2 == pass1){
    return true;
  }else{
    return false;
  }
}
validateUserData(user){
  return new Promise((resolve, reject) => {
    if(user.username == undefined ||user.username.length < 1){
      return reject("username");
    }else if(!this.validateEmail(user.email)){
      reject("email");
    }else if(user.password == undefined || user.password.length < 5){
      reject("the password field");
    }else if(user.password2 == undefined || user.password.length < 5){
        reject("the other password field");
    }else if(!this.checkPasswords(user.password, user.password2)){
        reject("both passwords");
    }
    resolve("done");
  });
}
}
