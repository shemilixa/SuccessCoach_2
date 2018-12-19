import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { HTTP } from '@ionic-native/http';


@IonicPage({
	name: 'InspirationPage'
})
@Component({
  selector: 'page-inspiration',
  templateUrl: 'inspiration.html',
})
export class InspirationPage {
	private videolist: any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public menuCtrl: MenuController,
    private http: HTTP,
  	private youtube: YoutubeVideoPlayer
  	) {
  	this.menuCtrl.close();
  	this.getVideoList();
  }

  getVideoList(){
    let url = "http://success-coach.ru/modules/video/";
    this.http.get(url, {}, {})
    .then(data => {      
      this.videolist = JSON.parse(data.data);     
    })
    .catch(error => {
      console.log(error.status);
      console.log(error.error);
      console.log(error.headers);
    });
  }

  doClick(){
    //открытие основного меню
    this.menuCtrl.toggle();
    this.menuCtrl.swipeEnable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspirationPage');
  }

  playVideo(url){

  	this.youtube.openVideo(url);
  }


}
