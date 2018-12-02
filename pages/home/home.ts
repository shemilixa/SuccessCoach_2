import { Component, OnInit } from '@angular/core';
import { NavController} from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage({
  name: 'HomePage'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

	public items: any = [];

  constructor(
  	public navCtrl: NavController,
  	private database: DatabaseProvider
  ) {
  	
  }

  ngOnInit() {	
  }


  ionViewDidLoad() {
    this.items = this.navCtrl['rootParams'];
  }

  ngAfterViewChecked(){
  }

  gotoPage(url){
    this.navCtrl.push(url);
  }

  dropTableSecond() {
  	this.database.dropTable('section')      
      .then(() => {
        console.log('ok');
        
      })
      .catch(error => {
        console.log('error');
      });
  	this.items = [];
  }  
}