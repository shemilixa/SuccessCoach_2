import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Modal, ModalController, AlertController, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { HTTP } from '@ionic-native/http';
@IonicPage({
	name: 'YearEditPage'
})
@Component({
  selector: 'page-year-edit',
  templateUrl: 'year-edit.html',
})
export class YearEditPage {
  public platform: string;
	public items: any = [];
  constructor(
    public plt: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public menuCtrl: MenuController,
  	public modalCtrl: ModalController,
  	private database: DatabaseProvider,
    private alertCtrl: AlertController,
    private http: HTTP
  	) {

    if(plt.is('cordova')){
      //если телефон
      this.platform = 'cordova';
    }
  }
  ionViewDidLoad() {
    this.items = this.navParams.get('sfer');
  }
  gotoPage(url, obj){
    this.navCtrl.push(url, {obj: obj, sfer: this.items});
  }
  doClick(){
    //открытие основного меню
    this.menuCtrl.toggle();
    this.menuCtrl.swipeEnable(true);
  }
  settingMenu(e){    
    e.target.nextElementSibling.style.top = "3vw";
    e.target.nextElementSibling.nextElementSibling.style.height = "100%";
  }
  settingMenuOff(e){
    if(e.deltaY < -50 && e.target.localName == 'li'){
      e.target.offsetParent.style.top = "-34vh";
      e.target.offsetParent.nextElementSibling.style.height = "0";
    } else if(e.target.id == "settingMenu"){
      e.target.style.top = "-34vh";
      e.target.nextElementSibling.style.height = "0";
    }
  }
  settingMenuOffclick(e){
    e.target.style.height = "0";
    e.target.previousElementSibling.style.top = "-34vh";
  }
  restoreSfer(){
    let alert = this.alertCtrl.create({
      title: 'Востановление сфер',
      message: 'При востановлении сфер удалятся все пользовательские сферы, а вместе с ними удалятся все поставленные задачи. Вы точно хотите востановить стандартные сферы?',
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Востановить',
          handler: () => {
            let url = "http://success-coach.ru?data=START";
            this.http.get(url, {}, {})
            .then(data => {
              let dataJson = JSON.parse(data.data);
              let yeargr: any = {};
              let yeardetailed: any = {};
              for(let i=0; i<dataJson.length; i++){
                if(dataJson[i].name == "yeargr"){
                  yeargr = dataJson[i];
                }else if(dataJson[i].name ==  'yeardetailed'){
                  yeardetailed = dataJson[i];
                }
              }
              this.restoreTable('yeardetailed', yeardetailed);
              this.restoreTable('yeargr', yeargr);
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error);
              console.log(error.headers);
            });
          }
        }
      ]
    });
    alert.present();
  }
  addSfer(){    
    let newSfer: Modal  = this.modalCtrl.create('ModalYearPage', {obj: {name: ''}});
    newSfer.present();

    newSfer.onDidDismiss((data)=>{
      if(data){
        this.addSferBase(data);
      } else {
        console.log('error');
      }      
    });
  }
  addSferBase(increased:any){
    let objSet = {
      name: increased.name,
      ord: '',
      ico: '12_default.svg'
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
  getDataSectionAll() {  
    if(this.platform == 'cordova'){
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
    } else {
      this.items = [
        {name: "Здоровье", ico: "1_health.svg", countPer: 0, count: 0 },
        {name: "Духовность", ico: "2_spirituality.svg", countPer: 0, count: 0 },
        {name: "Отношения", ico: "3_relation.svg", countPer: 0, count: 0 },
        {name: "Окружение", ico: "4_environment.svg", countPer: 0, count: 0 },
        {name: "Яркость жизни", ico: "5_Brightness_of_life.svg", countPer: 0, count: 0 },
        {name: "Призвание", ico: "6_calling.svg", countPer: 0, count: 0 },
        {name: "Самосовершенствование", ico: "7_selfimprovement.svg", countPer: 0, count: 0 },
        {name: "Финансы", ico: "8_finance.svg", countPer: 0, count: 0 },
        {name: "Благотворительность", ico: "9_charity.svg", countPer: 0, count: 0 },
        {name: "Недвижимость", ico: "10_realty.svg", countPer: 0, count: 0 },
        {name: "Мечты", ico: "11_dreams.svg", countPer: 0, count: 0 }
      ];
    }
  }
  deleteSfer(index){
    let alert = this.alertCtrl.create({
      title: 'Удаление сферы '+this.items[index].name,
      message: 'При удалении сферы удаляются все поставленные задачи в этой сфера. Вы точно хотите удалить эту сферу?',
      buttons: [
        {
          text: 'Отмена',
          role: 'cancel',
          handler: () => {
            console.log('не удалять');
          }
        },
        {
          text: 'Удалить',
          handler: () => {
            this.database.deleteElementTable('yeargr', this.items[index].rowid);
            let obj: any = [];
            for(let i=0; i<this.items.length; i++){
              if(i!=index){
                obj.push(this.items[i]);
              }
            }
            this.items=obj;
          }
        }
      ]
    });
    alert.present();
  }
  restoreTable(nameTable, obj) {
    this.database.dropTable(nameTable)
      .then(() => {
        console.log('ok');
        this.database.createTable(nameTable, obj)
        .then(() => {
          if(obj.url){
            this.http.get(obj.url, {}, {})
            .then(data => {
              let dataJson = JSON.parse(data.data);    
              console.log(dataJson);          
              for(let i=0; i<dataJson.length; i++){
                let nameCellStr = [];               
                for(var nameCell in dataJson[i]){                  
                 nameCellStr.push(dataJson[i][nameCell]);
                }
                this.database.insertDataTables (nameTable, nameCellStr)
                .then(() => {
                  if(i == dataJson.length-1){
                    this.getDataSectionAll();
                  }
                });
              }   
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error);
              console.log(error.headers);
            });
          }          
        });
      })
      .catch(error => {
        console.log('error');
      });
    this.items = [];
  }
}