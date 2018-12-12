import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-task-user-day',
  templateUrl: 'modal-task-user-day.html',
})
export class ModalTaskUserDayPage {
  public data: any = {};
  public date: string;
  public currentTime: string;
  constructor(
  	public navParams: NavParams,
  	private view: ViewController
  	) {
  }

  ionViewDidLoad() {
  }


  ionViewWillLoad() {
    this.date = this.navParams.get('date');

    let d = new Date();
    let dd = d.getDate();
    let mm = d.getMonth() + 1;
    let yy = d.getFullYear();

    if(this.date == String(yy)+String(mm)+String(dd)){
      var hh = d.getHours();
      var i = d.getMinutes();
      this.currentTime = hh+':'+i;
    } else {
      this.currentTime = '00:00';
    }
    //console.log(this.date);
  }

  createTask(){
  	console.dir(this.data);
  	let artimeStart = this.data.timeStart.split(':');
  	let artimeFinish = this.data.timeFinish.split(':');
  	this.data.timeStart = (artimeStart[0]*60)+Number(artimeFinish[1]);
  	this.data.timeFinish = (artimeFinish[0]*60)+Number(artimeFinish[1]);

  	this.view.dismiss(this.data);	
  }

  closeModal(){
  	this.view.dismiss();
  }

}
