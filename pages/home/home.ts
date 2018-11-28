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
    this.getDataSectionAll();
  }

  ngAfterViewChecked(){
  }

  gotoPage(url){
    //console.log(url);
    let urls = 'YearPage';
    this.navCtrl.push(urls);
  }


  addTables(){
  }

  
  getDataSectionAll() {  	
  	this.database.getDataAll('section')
    .then(res => {
  		if(res.rows.length>0) {	
  	 		var items = [];		    
  	    for(var i=0; i<res.rows.length; i++) {
  	      items.push({rowid:res.rows.item(i).rowid,name:res.rows.item(i).name,url:res.rows.item(i).url,active:res.rows.item(i).active})
  		  }
  		 this.items = items;
  		}						
  	})
    .catch(error => {
      console.log('это компютер');
      console.log(error.status);
      console.log(error.error);
      console.log(error.headers);
    });
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
