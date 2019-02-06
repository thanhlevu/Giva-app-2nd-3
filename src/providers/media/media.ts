import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PostingForm,
  Picture,
  User,
  LoginResponse,
  TagsResponse
} from "../../intefaces/posting";
@Injectable()
export class MediaProvider {
  configUrl = "https://media.mw.metropolia.fi/wbma";
  picArray: Picture[];
  loggedIn = false;
  token: string;
  user_id: number;
  constructor(public http: HttpClient) {
    console.log("Hello MediaProvider Provider");
  }
  getAllMedia() {
    return this.http.get<Picture[]>(this.configUrl + "/media");
  }

  getSingleMedia(id) {
    return this.http.get<Picture>(this.configUrl + "/media/" + id);
  }

  getAvatars() {
    return this.http.get<TagsResponse[]>(
      "https://media.mw.metropolia.fi/wbma/tags/profile"
    );
  }

  onRegister(formValues) {
    const url = this.configUrl + "/users";

    this.http.post(url, formValues).subscribe(status => {
      alert(status["message"]);
    });
  }

  login(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-type": "application/json"
      })
    };
    return this.http.post<LoginResponse>(
      this.configUrl + "/login",
      user,
      httpOptions
    );
  }
  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-type": "application/json"
      })
    };
    delete user.password2;
    return this.http.post<LoginResponse>(
      this.configUrl + "/users",
      user,
      httpOptions
    );
  }
  checkIfUserExists(user: User) {
    return this.http.get(this.configUrl + "/users/username/" + user.username);
  }

  getUsersInfo() {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    if (this.user_id) {
      return this.http.get(
        this.configUrl + "/users/" + this.user_id,
        httpOptions
      );
    }
  }

  upload(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.post<LoginResponse>(
      this.configUrl + "/media",
      data,
      httpOptions
    );
  }

  updateUserInfo(userInfo: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.put(this.configUrl + "/users", userInfo, httpOptions);
  }
}
