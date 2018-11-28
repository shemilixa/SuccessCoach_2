import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { HTTP } from '@ionic-native/http';


@IonicPage({
  name: 'YearPage'
})
@Component({
  selector: 'page-year',
  templateUrl: 'year.html',
})
export class YearPage {
	public items: any = [];

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private database: DatabaseProvider,
    private http: HTTP
  	) {
  }


  ionViewDidLoad() {
    this.getDataSectionAll();
  }

  gotoPage(url, id){
    this.navCtrl.push(url, {id: id});
  }

  getDataSectionAll() {  	
  	this.database.getDataAll('yeargr')
    .then(res => {
  		if(res.rows.length>0) {
  	 		var items = [];		    
  	    for(var i=0; i<res.rows.length; i++) {
  	      items.push({rowid:res.rows.item(i).rowid,name:res.rows.item(i).name,ord:res.rows.item(i).ord,ico:res.rows.item(i).ico})
  		  }
  		 this.items = items;
  		 console.log(items);
  		}						
  	});
  }

  addGroup(){
    let objSet = {
      name: 'Тестовая строка',
      ord: '13',
      ico: ''
    };
    this.database.insertDataTables('yeargr', [objSet.name, objSet.ord, objSet.ico])
      .then((data) => {
        let objGet = {
          rowid: data['insertId'],
          name: objSet['name'],
          ord: objSet['ord'],
          ico: objSet['ico'],
        };
        this.items.push(objGet);  
        console.log(data['insertId']);
    });
  }


  dropTableSecond() {
  	this.database.dropTable('yeargr')
      .then(() => {
        console.log('ok');
        
      })
      .catch(error => {
        console.log('error');
      });
  	this.items = [];
  }


}
