import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-view-training',
  templateUrl: 'view-training.html',
})
export class ViewTrainingPage {

  public myGif:any = document.getElementById ("myGif");  
  public playlist: any; //массив упражнений

  public counter:number = 0;
  public iterator:number = 0;
  public iteratorView:number = 0;
  public iteratorPlaylist:number = 0;
  public timeout:number = 0;

  public srcGif:string = "http://success-coach.ru/modules/workout/0_r.gif";

  constructor(
    private navParams: NavParams,
  	private view: ViewController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewTrainingPage');
  }

  ionViewWillLoad() {
    this.playlist = this.navParams.get('exercises');
 }

  closeModal(){
    this.counter = 0;
    this.iterator = 0;
    this.iteratorView = 0;
    this.iteratorPlaylist = 0;
    this.timeout = 0;
    this.view.dismiss();
  }

  playBtn(){
    this.counter = this.playlist[this.iteratorPlaylist]["count"];       
    this.playText();
  }


  playText(){
    setTimeout(()=> {  
      document.getElementById("circleIterator").style.display = "block"; 
      document.getElementById("tabloIterator").style.display = "flex"; 
      document.getElementById("gifPlay").style.display = "none";
      document.getElementById("textPlay").style.display = "flex";
      document.getElementById("startTrening").style.display = "none";
      setTimeout(()=> {      
        document.getElementById("textPlay").style.display = "none";
        document.getElementById("gifPlay").style.display = "block";   
        this.playVideo();
      }, 4000); 
    }, 500);    
  }

  playVideo(){
    this.srcGif = "";
    if (this.counter>this.iterator){        
        this.srcGif = "";
        setTimeout(()=> { 
          this.srcGif = this.playlist[this.iteratorPlaylist]["url"];
          this.timer();
          this.iterator++;          
        }, 10);
    } else {
      setTimeout(()=> {  
        this.playlist_next();
      }, 500);       
    }         
  }

  timer(){    
    this.timeout = this.playlist[this.iteratorPlaylist]["timeout"];
    setTimeout(()=> { this.playVideo();  this.iteratorView++;}, this.timeout);
  }

  playlist_next(){
    this.iteratorPlaylist++;      
    this.iterator = 0;
    this.iteratorView = 0;   
    if(this.playlist.length>this.iteratorPlaylist){
        this.counter = this.playlist[this.iteratorPlaylist]["count"];        
        this.playText();
    } else {
      this.counter = 0;
      this.iteratorPlaylist = 0;
      this.srcGif = "http://success-coach.ru/modules/workout/0_r.gif";
      document.getElementById("startTrening").style.display = "block";
      document.getElementById("circleIterator").style.display = "none"; 
      document.getElementById("tabloIterator").style.display = "none"; 
    }
  }

}
