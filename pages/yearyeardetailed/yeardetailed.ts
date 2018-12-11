import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, Modal, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
@IonicPage(
	name: 'YeardetailedPage'
	)
@Component({
  selector: 'page-yeardetailed',
  templateUrl: 'yeardetailed.html',
})
export class YeardetailedPage {
  public taskActive: any = [];
  public taskCompleted: any = [];
  public allGroup: any = [];
  public group: any = {};
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private database: DatabaseProvider) {
  }
  ionViewDidLoad() {    
    //this.test();
    this.group = this.navParams.get('obj');
    this.allGroup = this.navParams.get('sfer');
    this.getDataSectionAll();
  }
  gotoPage(url){
    this.navCtrl.push(url, {sfer: this.allGroup});
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
  test(){
    this.taskActive = [
      {rowid: 0, idgroup: 1, name: "Тестовая задача 1 Тестовая задача 1 Тестовая задача 1 Тестовая задача 1", description: "", importance: "", startdate: "", finisshdate: "", status: 1 },
      {rowid: 1, idgroup: 1, name: "Тестовая задача 1", description: "", importance: "", startdate: "", finisshdate: "", status: 1 },
      {rowid: 2, idgroup: 1, name: "Тестовая задача 2", description: "", importance: "", startdate: "", finisshdate: "", status: 1 },
      {rowid: 3, idgroup: 1, name: "Тестовая задача 3", description: "", importance: "", startdate: "", finisshdate: "", status: 1 }];
    this.taskCompleted = [
      {rowid: 1, idgroup: 1, name: "Тестовая задача 1", description: "", importance: "", startdate: "", finisshdate: "", status: 1 },
      {rowid: 1, idgroup: 1, name: "Тестовая задача 1", description: "", importance: "", startdate: "", finisshdate: "", status: 1 },
      {rowid: 1, idgroup: 1, name: "Тестовая задача 1", description: "", importance: "", startdate: "", finisshdate: "", status: 1 },
      {rowid: 1, idgroup: 1, name: "Тестовая задача 1", description: "", importance: "", startdate: "", finisshdate: "", status: 1 }];
  }
  doClick(){
    this.menuCtrl.toggle();
  }
  statusTask(indexObj){
    this.taskCompleted.unshift(this.taskActive[indexObj]);
    this.database.updateElementTable('yeardetailed', this.taskActive[indexObj].rowid,  'status=1' );
    let ogj:any = [];
    for(let i=0; i<this.taskActive.length; i++){
      if(i!=indexObj){
        ogj.push(this.taskActive[i]);
      }
    }
    this.taskActive = ogj;
  }
  infoTask(obj){
    let alert = this.alertCtrl.create({
      title: obj.name,
      subTitle: obj.description,
      buttons: ['Закрыть']
    });
    alert.present();
  }
  deleteTask(indexObj){
    this.database.deleteElementTable('yeardetailed', this.taskActive[indexObj].rowid);
    let ogj:any = [];
    for(let i=0; i<this.taskActive.length; i++){
      if(i!=indexObj){
        ogj.push(this.taskActive[i]);
      }
    }
    this.taskActive = ogj;    
  }
  editTask(e, indexObj){
    console.log(indexObj);
    let newTask: Modal  = this.modalCtrl.create('ModalTaskYearPage', {sections: this.allGroup, obj: this.taskActive[indexObj]});
    newTask.present();
   newTask.onDidDismiss((data)=>{
      if(data){
        this.updateTask(e, data);
      } else {
        console.log('error');
      }      
    });
  }
  updateTask(e, obj){
    //this.database.updateElementTable('yeardetailed', this.taskActive[indexObj].rowid,  'status=1' );
    let tasks: any = [];
    for(let i=0; i<this.taskActive.length; i++){

      if(this.taskActive[i].rowid==obj.rowid){
        if(obj.idgroup == this.group.rowid){
          this.taskActive[i].name = obj.name; 
          this.taskActive[i].description = obj.description;
          this.taskActive[i].idgroup = obj.idgroup;
        }
        this.database.updateElementTable('yeardetailed', this.taskActive[i].rowid,  "name='"+obj.name+"', description='"+obj.description+"', idgroup="+obj.idgroup );
      } 
      if(this.group.rowid == this.taskActive[i].idgroup){
          tasks.push(this.taskActive[i]);
      }
    }
    this.taskActive = tasks;    
    //console.log(e);
    e.target.offsetParent.offsetParent.style.transform = "translateX(1vw) translateZ(0)";
  }
  seetingpanel(e, elem){
    if(e.deltaX < -15){
      //открыть
      e.target.offsetParent.style.transform = "translateX(-43vw) translateZ(0)";
    }
    if(e.deltaX > 15){
      //закрыть
      e.target.offsetParent.style.transform = "translateX(1vw) translateZ(0)";
    }
  }
  addTask(){
    let newTask: Modal  = this.modalCtrl.create('ModalTaskYearPage', {sections: this.allGroup, obj:{name: '', description: '', idgroup: this.group.rowid }});
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
    if(increased.name != ''){
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
  }
  getDataSectionAll() {   
    let option = ' WHERE idgroup='+ this.group.rowid;
    this.database.getDataAll('yeardetailed', option)
    .then(res => {
      if(res.rows.length>0) { 
        var itemsTaskActive = [];   
        var itemsTaskCompleted = [];   
        for(var i=0; i<res.rows.length; i++) {
          if(res.rows.item(i).status == 1){
            itemsTaskCompleted.push({rowid:res.rows.item(i).rowid,
                      idgroup:res.rows.item(i).idgroup,
                      name:res.rows.item(i).name,
                      description:res.rows.item(i).description,
                      importance:res.rows.item(i).importance,
                      startdate:res.rows.item(i).startdate,
                      finisshdate:res.rows.item(i).finisshdate,
                      status:res.rows.item(i).status
                    });
          } else {            
            itemsTaskActive.push({rowid:res.rows.item(i).rowid,
              idgroup:res.rows.item(i).idgroup,
              name:res.rows.item(i).name,
              description:res.rows.item(i).description,
              importance:res.rows.item(i).importance,
              startdate:res.rows.item(i).startdate,
              finisshdate:res.rows.item(i).finisshdate,
              status:res.rows.item(i).status
            });
          }
        }
       this.taskActive = itemsTaskActive;
       this.taskCompleted = itemsTaskCompleted;
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
    this.taskActive = [];
    this.taskCompleted = [];
  }
}
