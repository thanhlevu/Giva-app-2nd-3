import { Pipe, PipeTransform } from "@angular/core";
import { MediaProvider } from "../../providers/media/media";
import { Picture } from "../../intefaces/interfaces";

@Pipe({
  name: "size"
})
export class SizePipe implements PipeTransform {
  constructor(public mediaProvider: MediaProvider) {}

  // get the proper size of image by using thumbnail
  transform(id: String, ...args) {
    console.log("id", id);
    return new Promise((resolve, rejects) => {
      this.mediaProvider.getFileDataById(id).subscribe((response: Picture) => {
        console.log("response", response);

        switch (args[0]) {
          case "Large":
            resolve(response.thumbnails.w640);
            break;
          case "medium":
            resolve(response.thumbnails.w320);
            break;
          case "screenshot":
            resolve(response.screenshot);
            break;
          case "small":
            resolve(response.thumbnails.w160);
            break;
        }
      });
    });
  }
}
