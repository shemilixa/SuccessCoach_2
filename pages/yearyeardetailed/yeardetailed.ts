import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the YeardetailedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
	name: 'YeardetailedPage'
	)
@Component({
  selector: 'page-yeardetailed',
  templateUrl: 'yeardetailed.html',
})
export class YeardetailedPage {
  public items: any = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private database: DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YeardetailedPage');
    console.log(this.navParams.get('id'));
    this.getDataSectionAll();
  }

  addTask(){
    let objSet = {
      idgroup: this.navParams.get('id'),
      name: 'Тестовая задача',
      description: '',
      importance: '',
      startdate: '',
      finisshdate: ''
    };
    this.database.insertDataTables('yeardetailed', [objSet.idgroup, objSet.name, objSet.description, objSet.importance, objSet.startdate, objSet.finisshdate ])
      .then((data) => {
        let objGet = {
          rowid: data['insertId'],
          idgroup: objSet['idgroup'],
          name: objSet['name'],
          description: objSet['description'],
          importance: objSet['importance'],
          startdate: objSet['startdate'],
          finisshdate: objSet['finisshdate']
        };
        this.items.push(objGet);  
        console.log(data['insertId']);
    });
  }

  getDataSectionAll() {   
    let option = ' WHERE idgroup='+ this.navParams.get('id');
    this.database.getDataAll('yeardetailed', option)
    .then(res => {
      if(res.rows.length>0) { 
        var items = [];       
        for(var i=0; i<res.rows.length; i++) {
          items.push({rowid:res.rows.item(i).rowid,
                      idgroup:res.rows.item(i).idgroup,
                      name:res.rows.item(i).name,
                      description:res.rows.item(i).description,
                      importance:res.rows.item(i).importance,
                      startdate:res.rows.item(i).startdate,
                      finisshdate:res.rows.item(i).finisshdate,
                    })
        }
       this.items = items;
       console.log(items);
      }           
    });
  }

  dropTable(){
    this.database.dropTable('yeardetailed')
      .then(() => {
        console.log('ok');
        
      })
      .catch(error => {
        console.log('error');
      });
    this.items = [];
  }

}
