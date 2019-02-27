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
  uploadFilePath = 'api/uploads/';
  loggedIn = false;
  token: string;
  user_id: number;
  user: User = null;

  constructor(public http: HttpClient) {
    // console.log("Hello MediaProvider Provider");
  }

  getAllMedia() {
    return this.http.get<Picture[]>('api/media');
  }

  getSingleMedia(id) {
    return this.http.get<Picture>('api/media/' + id);
  }

  getAvatars() {
    return this.http.get<TagsResponse[]>('api/tags/profile');
  }

  getMyItems() {
    return this.http.get<Picture[]>('api/media/user/' + this.user_id);
  }

  getFilesByTag(tag: string) {
    // single file
    return this.http.get<Picture[]>('api/tags/' + tag);
  }

  onRegister(formValues) {
    const url = 'api/users';

    this.http.post(url, formValues).subscribe(status => {
      alert(status['message']);
    });
  }

  login(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };
    return this.http.post<LoginResponse>(
      'api/login',
      user,
      httpOptions
    );
  }
  register(user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };
    delete user.password2;
    return this.http.post<LoginResponse>(
      'api/users',
      user,
      httpOptions
    );
  }
  checkIfUserExists(user: User) {
    return this.http.get('api/users/username/' + user.username);
  }

  getUsersInfo() {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };
    if (this.user_id) {
      return this.http.get(
        'api/users/' + this.user_id,
        httpOptions
      );
    }
  }

  upload(data: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.post<TagsResponse>(
      'api/media',
      data,
      httpOptions
    );
  }

  updateFileInfo(file_id, newFormData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.put<TagsResponse>(
      'api/media/' + file_id,
      newFormData,
      httpOptions
    );
  }

  updateUserInfo(userInfo: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };
    return this.http.put('api/users', userInfo, httpOptions);
  }

  deleteFile(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };
    return this.http.delete('api/media/' + file_id, httpOptions);
  }

  addTag_Giva(file_id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-access-token': this.token
      })
    };
    return this.http.post(
      'api/tags',
      {
        file_id: file_id,
        tag: 'GIVA'
      },
      httpOptions
    );
  }
}
