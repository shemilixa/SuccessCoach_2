import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ViewTrainingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-training',
  templateUrl: 'view-training.html',
})
export class ViewTrainingPage {

  public playlist: any= [
    {"url":"http://success-coach.ru/modules/workout/1.mp4", "name": "Дыхание", "count": 2, "timeout": 5000},
    {"url":"http://success-coach.ru/modules/workout/2.mp4", "name": "махи", "count": 5, "timeout": 2000},
  ];

  public counter:number = 0;
  public iterator:number  = 0;
  public iteratorPlaylist:number  = 0;
  public timeout:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTrainingPage');
  }

  playBtn(){
    var myVideo = document.getElementById ("myVideo");
    this.counter = this.playlist[0]["count"];
    myVideo.setAttribute("src", this.playlist[0]["url"]);
    this.iterator = 0;            
    this.playVideo();
  }

  playVideo(){
    var myVideo = document.getElementById ("myVideo");
    if (this.counter>this.iterator){
        this.iterator++;
        this.timer();
        //myVideo.play();  
    } else {
        this.playlist_next();
    } 
  } 
    
  timer(){
    this.timeout = this.playlist[this.iteratorPlaylist]["timeout"];
    setTimeout(()=> { this.playVideo(); }, this.timeout);
  }


  playlist_next(){
    var myVideo = document.getElementById ("myVideo");
    this.iteratorPlaylist++;         
    if(this.playlist.length>this.iteratorPlaylist){
        this.counter = this.playlist[this.iteratorPlaylist]["count"];
        myVideo.setAttribute("src", this.playlist[this.iteratorPlaylist]["url"]);
        this.iterator = 0;
        this.playVideo();
    }
  }



}
