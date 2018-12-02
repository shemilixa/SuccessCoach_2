import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspirationPage } from './inspiration';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

@NgModule({
  declarations: [
    InspirationPage,
  ],
  imports: [
    IonicPageModule.forChild(InspirationPage),
  ],
  providers: [
  	YoutubeVideoPlayer
  ]
})
export class InspirationPageModule {}
