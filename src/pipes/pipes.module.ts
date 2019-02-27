import { NgModule } from '@angular/core';
import { GetByTagPipe } from './get-by-tag/get-by-tag';
import { GetUserTagPipe } from './get-user-tag/get-user-tag';
import { ThumbnailPipe } from './thumbnail/thumbnail';
@NgModule({
	declarations: [GetByTagPipe,
    GetUserTagPipe,
    ThumbnailPipe],
	imports: [],
	exports: [GetByTagPipe,
    GetUserTagPipe,
    ThumbnailPipe]
})
export class PipesModule {}
