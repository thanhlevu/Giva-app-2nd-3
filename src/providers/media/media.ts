import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PostingForm,
  Picture,
  User,
  LoginResponse,
  TagsResponse,
  ServerResponse,
  CommentsResponse
} from "../../intefaces/posting";
import { FavoriteResponse } from "../../intefaces/posting";

@Injectable()
export class MediaProvider {
  configUrl = "http://media.mw.metropolia.fi/wbma";
  picArray: Picture[];
  loggedIn = false;
  token: string;
  user_id: number;
  constructor(public http: HttpClient) {
    console.log("Hello MediaProvider Provider");
  }
  /*   getAllMedia() {
    return this.http.get<Picture[]>(this.configUrl + "/media");
  }

  getSingleMedia(id) {
    return this.http.get<Picture>(this.configUrl + "/media/" + id);
  } */

  getAvatars() {
    return this.http.get<TagsResponse[]>(this.configUrl + "/tags/profile");
  }

  getAllItemsWithGivaTag() {
    return this.http.get<Picture[]>(this.configUrl + "/tags/GIVA");
  }

  getMyItems() {
    return this.http.get<Picture[]>(
      this.configUrl + "/media/user/" + localStorage.getItem("userID")
    );
  }

  getAllMyFavoriteItems() {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.get<FavoriteResponse[]>(
      this.configUrl + "/favourites",
      httpOptions
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
    if (localStorage.getItem("userID")) {
      return this.http.get(
        this.configUrl + "/users/" + localStorage.getItem("userID"),
        httpOptions
      );
    }
  }

  getTagsByFileId(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.get<TagsResponse[]>(
      this.configUrl + "/tags/file/" + file_id,
      httpOptions
    );
  }

  getOtherUsersInfo(user_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.get(this.configUrl + "/users/" + user_id, httpOptions);
  }

  uploadImage(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.post<TagsResponse>(
      this.configUrl + "/media",
      data,
      httpOptions
    );
  }

  updateFileInfo(file_id, UpdateContent) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": localStorage.getItem("token")
      })
    };
    return this.http.put<ServerResponse>(
      this.configUrl + "/media/" + file_id,
      UpdateContent,
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

  deleteFile(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.delete(this.configUrl + "/media/" + file_id, httpOptions);
  }

  sendComment(commentObject) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.post<ServerResponse>(
      this.configUrl + "/comments",
      commentObject,
      httpOptions
    );
  }

  getAllComments(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    console.log("this.configUrl", this.configUrl + "/comments/file/" + file_id);
    return this.http.get<CommentsResponse[]>(
      this.configUrl + "/comments/file/" + file_id,
      httpOptions
    );
  }

  deleteComment(comment_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    console.log(
      "this.configUrl",
      this.configUrl + "/comments/file/" + comment_id
    );
    return this.http.delete<ServerResponse[]>(
      this.configUrl + "/comments/" + comment_id,
      httpOptions
    );
  }

  addTag_Giva(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.post(
      this.configUrl + "/tags",
      {
        file_id: file_id,
        tag: "GIVA"
      },
      httpOptions
    );
  }

  getFileDataById(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.get<Picture>(
      this.configUrl + "/media/" + file_id,
      httpOptions
    );
  }

  addTag_Category(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.post(this.configUrl + "/tags", data, httpOptions);
  }

  deleteTag_Category(tag_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.delete(this.configUrl + "/tags/" + tag_id, httpOptions);
  }

  getFilesByTag(tag) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.get<Picture[]>(
      this.configUrl + "/tags/" + tag,
      httpOptions
    );
  }

  getFilesByTitle(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.post(this.configUrl + "/media/search", data, httpOptions);
  }

  addFavorite(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-access-token": this.token
      })
    };
    return this.http.post<Response>(
      this.configUrl + "/favourites",
      data,
      httpOptions
    );
  }

  deleteFavourite(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-access-token": this.token
      })
    };
    return this.http.delete(
      this.configUrl + "/favourites/file/" + id,
      httpOptions
    );
  }

  getAllFavourites() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-access-token": this.token
      })
    };
    return this.http.get<FavoriteResponse[]>(
      this.configUrl + "/favourites",
      httpOptions
    );
  }

  SearchWithWord(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-access-token": this.token
      })
    };
    return this.http.post<Picture[]>(
      this.configUrl + "/media/search",
      data,
      httpOptions
    );
  }
}
