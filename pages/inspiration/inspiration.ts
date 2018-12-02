import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';


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
  	private youtube: YoutubeVideoPlayer
  	) {
  	this.menuCtrl.close();
  	this.getVideoList();
  }

  getVideoList(){
  	this.videolist = [
  		{name: "Утро. Твой самый лучший день", url: "1RoWtvvmutA", img: "https://i.ytimg.com/vi_webp/1RoWtvvmutA/sddefault.webp" },
  		{name: "Быстрый психологический отдых", url: "f3hbcXNt2l8", img: "https://i.ytimg.com/vi_webp/f3hbcXNt2l8/sddefault.webp" },
  		{name: "Настрой на новый день", url: "HJX6_LhKKUo", img: "https://i.ytimg.com/vi_webp/HJX6_LhKKUo/hqdefault.webp" }
  	];
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
