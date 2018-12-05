import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  MenuController, Modal, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

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
    public menuCtrl: MenuController,
    public modalCtrl: ModalController
  	) {

    this.menuCtrl.close();
  }

  ionViewDidLoad() { 
    this.getDataSectionAll();
  }

  gotoPage(url, obj){
    this.navCtrl.push(url, {obj: obj, sfer: this.items});
  }

  doClick(){
    //открытие основного меню
    this.menuCtrl.toggle();
    this.menuCtrl.swipeEnable(true);
  }

  getDataSectionAll() {  
    //получаю из базы список групп
    this.items = [];	
  	this.database.getDataAll('yeargr')    
    .then(res => {
  		if(res.rows.length>0) {   
  	    for(var i=0; i<res.rows.length; i++) {
          let obj = res.rows.item(i);
          this.database.getCountTask(obj.rowid)
          .then(con => {
            //console.log(con.rows.item(0));
            let countPerformed = 0;
            if(con.rows.item(0).countPerformed){
              countPerformed = con.rows.item(0).countPerformed;
            }
            this.items.push({rowid:obj.rowid,name:obj.name,ord:obj.ord,ico:obj.ico, count:con.rows.item(0).countTask, countPer:countPerformed });

          }).catch(error => {
            console.log('error');
            //items.push({rowid:obj.rowid,name:obj.name,ord:obj.ord,ico:obj.ico, con:'0' });
          });            
  		  }
  		}						
  	}); 
  }


  addTask(){    
    let newTask: Modal  = this.modalCtrl.create('ModalTaskYearPage', {sections: this.items, obj:{name: '', description: '', idgroup: '' }});
    newTask.present();

    newTask.onDidDismiss((data)=>{
      if(data){
        this.addTaskBase(data);
      } else {
        console.log('error');
      }      
    });
  }

  addTaskBase(increased:any){
    //метод записывает в базу данных ответ из модального окна
    //записыват задачи в определенную группу
    let objSet = {
      idgroup: increased.idgroup,
      name: increased.name,
      description: increased.description,
      importance: '',
      startdate: '',
      finisshdate: '',
      status: ''
    };
    this.database.insertDataTables('yeardetailed', [objSet.idgroup, objSet.name, objSet.description, objSet.importance, objSet.startdate, objSet.finisshdate, objSet.status ])
      .then((data) => {
        this.getDataSectionAll();
    });
  }

  settingMenu(e){
    e.target.nextElementSibling.style.top = "3vw";

  }

  settingMenuOff(e){
    if(e.deltaY < -50){
      e.target.offsetParent.style.top = "-34vh";
    }    
  }

  //не используемые методы//
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



