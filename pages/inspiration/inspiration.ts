import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
	name: 'InspirationPage'
})
@Component({
  selector: 'page-inspiration',
  templateUrl: 'inspiration.html',
})
export class InspirationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspirationPage');
  }

}
