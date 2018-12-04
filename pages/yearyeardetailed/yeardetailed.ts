import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage(
	name: 'YeardetailedPage'
	)
@Component({
  selector: 'page-yeardetailed',
  templateUrl: 'yeardetailed.html',
})
export class YeardetailedPage {
  public items: any = [];
  public taskActive: any = [];
  public taskCompleted: any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private database: DatabaseProvider) {
  }


  ionViewDidLoad() {
    this.test();
   // this.getDataSectionAll();
  }

  test(){
    this.taskActive = [
      {
        rowid: 0,
        idgroup: 1,
        name: "Тестовая задача 1 Тестовая задача 1 Тестовая задача 1 Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      },
      {
        rowid: 1,
        idgroup: 1,
        name: "Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      },
      {
        rowid: 2,
        idgroup: 1,
        name: "Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      },
      {
        rowid: 3,
        idgroup: 1,
        name: "Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      }
    ];
    this.taskCompleted = [
      {
        rowid: 1,
        idgroup: 1,
        name: "Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      },
      {
        rowid: 1,
        idgroup: 1,
        name: "Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      },
      {
        rowid: 1,
        idgroup: 1,
        name: "Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      },
      {
        rowid: 1,
        idgroup: 1,
        name: "Тестовая задача 1",
        description: "",
        importance: "",
        startdate: "",
        finisshdate: "",
        status: 1        
      }
    ];

  }

  doClick(){
    this.menuCtrl.toggle();
  }

  seetingpanel(e, elem){
console.log(e);
    if(e.deltaX < -15){
      console.log(e);
      //e.target.style.transform = "translateX(36vw) translateZ(0)";
      document.getElementById('panel_'+elem).style.transform = "translateX(-45vw) translateZ(0)";
    }

    if(e.deltaX > 15){
       document.getElementById('panel_'+elem).style.transform = "translateX(0vw) translateZ(0)";
    }
  }

  addTask(){
    let objSet = {
      idgroup: this.navParams.get('id'),
      name: 'Тестовая задача',
      description: '',
      importance: '',
      startdate: '',
      finisshdate: '',
      status: ''
    };
    this.database.insertDataTables('yeardetailed', [objSet.idgroup, objSet.name, objSet.description, objSet.importance, objSet.startdate, objSet.finisshdate, objSet.status ])
      .then((data) => {
        let objGet = {
          rowid: data['insertId'],
          idgroup: objSet['idgroup'],
          name: objSet['name'],
          description: objSet['description'],
          importance: objSet['importance'],
          startdate: objSet['startdate'],
          finisshdate: objSet['finisshdate'],
          status: objSet['status']
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
                      status:res.rows.item(i).status
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
