import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage(
	name: 'DayPage'
	)
@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DayPage');
  }

}
