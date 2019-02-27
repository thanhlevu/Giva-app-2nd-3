import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../../intefaces/posting';
import { GetByTagPipe } from './../../pipes/get-by-tag/get-by-tag';
import { PostViewPage } from '../post-view/post-view';
import { PostEditPage } from '../post-edit/post-edit';

/**
 * Generated class for the MyItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-items',
  templateUrl: 'my-items.html'
})
export class MyItemsPage {
  picArray: Picture[] = [];
  tagPipe: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mediaProvider: MediaProvider,
    public http: HttpClient
  ) {
    this.tagPipe = new GetByTagPipe(this.mediaProvider);
  }
  /*
    ionViewDidLoad() {
      console.log('ionViewDidLoad MyItemsPage');
      return this.mediaProvider.getMyItems().subscribe(data => {
        this.picArray = data;
        console.log(this.picArray);
      });
    }
    this.picArray = files.sort(
            (a, b) => Number(b.file_id) - Number(a.file_id)
          );
  */
  ionViewDidLoad() {
    this.loadMyItems();
  }

  loadMyItems() {
    this.tagPipe.transform('GIVA').then((files: Picture[]) => {
      files.forEach((file: Picture) => {
        if (file.user_id === this.mediaProvider.user.user_id) {
          this.picArray.push(file);
        }
      });
      return this.picArray.sort((a, b) => Number(b.file_id) - Number(a.file_id));
    });
  }

  viewPost(Pic: Picture) {
    this.navCtrl.push(PostEditPage, Pic);
    // console.log(Pic);
  }
}
