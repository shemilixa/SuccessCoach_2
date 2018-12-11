import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-task-user-day',
  templateUrl: 'modal-task-user-day.html',
})
export class ModalTaskUserDayPage {
  public data: any = {};
  constructor(
  	public navParams: NavParams,
  	private view: ViewController
  	) {
  }

  ionViewDidLoad() {
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
