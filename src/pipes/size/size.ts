import { Pipe, PipeTransform } from '@angular/core';
import { MediaProvider } from '../../providers/media/media';
import { Picture } from '../../intefaces/posting';

@Pipe({
  name: 'size',
})
export class SizePipe implements PipeTransform {
  
  constructor(public mediaProvider: MediaProvider){

  }

  transform(id: String, ...args) {
    console.log("id", id);
    return new Promise((resolve, rejects) => {
      this.mediaProvider.getSingleMedia(id).subscribe((response: Picture) =>{
        switch(args[0]){
          case 'Large':
          resolve(response.thumbnails.w640);
          break;
          case 'medium':
          resolve(response.thumbnails.w320);
          break;
          case 'screenshot':
          resolve(response.screenshot);
          break;
          case 'small':
          resolve(response.thumbnails.w160);
          break;
          
        }
      });
    });
    }
  }
