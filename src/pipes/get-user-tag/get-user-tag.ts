import { Pipe, PipeTransform } from '@angular/core';
import { MediaProvider } from '../../providers/media/media';
import { Picture } from '../../intefaces/posting';

@Pipe({
  name: 'getUserTag',
})
export class GetUserTagPipe implements PipeTransform {

  constructor(public mediaProvider: MediaProvider) {

  }

  async transform(tag: string) {
    return new Promise((resolve, reject) => {
      this.mediaProvider.getFilesByTag(tag).subscribe((files: Picture[]) => {
        files.forEach((file: Picture) => {
          if (file.user_id === this.mediaProvider.user.user_id) {
            resolve(file.file_id);
          } else {
            // reject('No profile image added.');
          }
        });
      });
    });
  }
}
