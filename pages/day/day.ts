import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

@IonicPage(
	name: 'DayPage'
	)
@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public menuCtrl: MenuController
  	) {
  	this.menuCtrl.close();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DayPage');
  }

  doClick(){
    this.menuCtrl.toggle();
  }

}
