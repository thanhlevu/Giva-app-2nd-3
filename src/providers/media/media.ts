import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PostingForm,
  Picture,
  User,
  LoginResponse,
  TagsResponse,
  ServerResponse,
  CommentsResponse,
  FavoriteResponse
} from "../../intefaces/interfaces";

@Injectable()
export class MediaProvider {
  configUrl = "http://media.mw.metropolia.fi/wbma";
  picArray: Picture[];
  token = localStorage.getItem("token");
  user_id = localStorage.getItem("userID");
  constructor(public http: HttpClient) {}

  // get all items with GIVA tag
  getAllItemsWithGivaTag() {
    return this.http.get<Picture[]>(this.configUrl + "/tags/GIVA");
  }

  // get my items
  getMyItems() {
    return this.http.get<Picture[]>(
      this.configUrl + "/media/user/" + localStorage.getItem("userID")
    );
  }

  // get all my favorite items
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

  // to check login
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

  // register a new account
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

  // check if the username is available
  checkIfUserExists(user: User) {
    return this.http.get(this.configUrl + "/users/username/" + user.username);
  }

  // get the user's data
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

  // get other users data
  getOtherUsersInfo(user_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.get(this.configUrl + "/users/" + user_id, httpOptions);
  }

  // get all tags of a file by file Id
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

  // upload the selected image to server
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

  // update info of file
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

  // update the user's info
  updateUserInfo(userInfo: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.put(this.configUrl + "/users", userInfo, httpOptions);
  }

  // delete a file by file_id
  deleteFile(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.delete(this.configUrl + "/media/" + file_id, httpOptions);
  }

  // send a comment to the post
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

  // get all comment of items by file_id
  getAllComments(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.get<CommentsResponse[]>(
      this.configUrl + "/comments/file/" + file_id,
      httpOptions
    );
  }

  // delete a commemt by comment_id
  deleteComment(comment_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.delete<ServerResponse>(
      this.configUrl + "/comments/" + comment_id,
      httpOptions
    );
  }

  // after uploading a image, add GIVA tag to it that we can distinguish between our project's posts and others
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

  // get file's data by file_id
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

  // after uploading image, add category tag that we can search for it by category
  addTag_Category(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.post(this.configUrl + "/tags", data, httpOptions);
  }

  // for updating image's category
  deleteTag_Category(tag_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.delete(this.configUrl + "/tags/" + tag_id, httpOptions);
  }

  // to load all items with a specific tag
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

  // get file by title = searching
  getFilesByTitle(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        "x-access-token": this.token
      })
    };
    return this.http.post(this.configUrl + "/media/search", data, httpOptions);
  }

  // add favorite to the item
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

  // delete favorite from the item by file_id
  deleteFavourite(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-access-token": this.token
      })
    };
    return this.http.delete(
      this.configUrl + "/favourites/file/" + file_id,
      httpOptions
    );
  }

  // get all favorite items
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
}
