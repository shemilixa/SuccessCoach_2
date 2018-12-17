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
  public give: string;
  constructor(
  	public navParams: NavParams,
  	private view: ViewController
  	) {
  }

  ionViewDidLoad() {
  }


  ionViewWillLoad() {
    this.date = this.navParams.get('date');
    let task: any = this.navParams.get('task');

    if(task){
     // console.log('обновление');
      this.data.new = 'update';
      this.data.rowid = task.rowid;
      this.data.name = task.name;
      this.data.description = task.description;
      this.data.timeStart = this.getTimeFromMins(task.timeStartMin);
      this.data.timeFinish  = this.getTimeFromMins(task.timeFinishMin);
      //this.data.timeStart = this.data.timeStart.toTimeString();
      //this.data.timeFinish = this.data.timeFinish.toTimeString();
      console.log(this.data.timeStart);
    } else {
      this.data.new = 'create';
    }

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
  	let artimeStart = this.data.timeStart.split(':');
  	let artimeFinish = this.data.timeFinish.split(':');
  	this.data.timeStart = (artimeStart[0]*60)+Number(artimeStart[1]);
  	this.data.timeFinish = (artimeFinish[0]*60)+Number(artimeFinish[1]);

    if(!this.data.description){
      this.data.description = '';
    }

  	this.view.dismiss(this.data);	
  }

  closeModal(){
  	this.view.dismiss();
  }

  getTimeFromMins(mins) {
      let hours = Math.trunc(mins/60);
      let hoursStr: string;
      let minutes = mins % 60;   
      if(String(hours).length == 1){
        hoursStr = '0'+String(hours);
      } else {
        hoursStr = String(hours);
      }
      if(minutes == 0){
        return hoursStr + ':00';
      } else {
        return hoursStr + ':' + minutes;
      }     
  };

}
