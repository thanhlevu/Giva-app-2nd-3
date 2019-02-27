import { Pipe, PipeTransform } from '@angular/core';
import { MediaProvider } from './../../providers/media/media';
import { Picture } from '../../intefaces/posting';

@Pipe({
  name: 'getByTag',
})
export class GetByTagPipe implements PipeTransform {
  constructor(public mediaProvider: MediaProvider) {

  }

  async transform(tag: string) {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getFilesByTag(tag).subscribe((files: Picture[]) => {
        resolve(files);
      });
    });
  }
}
