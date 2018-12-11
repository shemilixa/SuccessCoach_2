import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Modal, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Platform } from 'ionic-angular';

@IonicPage(
	name: 'DayPage'
	)
@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {
  public platform: string;
  public heightPlaner: number = 200;
  public hour: number = this.heightPlaner/24;
  public minute: number = this.heightPlaner/(24*60);
  public lineThickness: number = 0.2;



  public timePlaner: any;
  public arrTasks: any = [];
  public currentTimeLiner: number;
  public tileDay: string;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public menuCtrl: MenuController,
    private database: DatabaseProvider,
    public plt: Platform,
    public modalCtrl: ModalController
  	) {
  	this.menuCtrl.close();
    if(plt.is('cordova')){
      //если телефон
      this.platform = 'cordova';
    }
  }

  ionViewDidLoad() {    
    this.makePlanerBlank();
    this.getDataSectionAll();
    this.currentTime();
    this.tileDay = 'Сегодня 11.12.2018 Вторник';
  }

  doClick(){
    this.menuCtrl.toggle();
  }

  makePlanerBlank(){
    document.getElementById("timeDay").style.height = this.heightPlaner+"vh";
    document.getElementById("taskDay").style.height = this.heightPlaner+"vh";   
    this.getTimePlaner();
  }


  getTimePlaner(){
    this.timePlaner = [
      '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ];

  }

  

  currentTime(){
    var d = new Date();
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yy = d.getFullYear();
    var hh = d.getHours();
    var i = d.getMinutes();

    this.currentTimeLiner = Number((hh*60+i)*this.minute);

    let hoursPX = document.querySelector(".scroll_region").clientHeight/24;
    //document.querySelector(".scroll_region").scrollTop=hoursPX*((min/60)*2);
    document.querySelector(".scroll_region").scrollTop=hoursPX*(hh*2);
  }

  getDataSectionAll() {     
    if(this.platform == 'cordova'){
      let option = '';
      this.database.getDataAll('daygr', option)
      .then(res => {
        if(res.rows.length>0) { 
          var items: any = [];
          for(var i=0; i<res.rows.length; i++) {          
              items.push({rowid:res.rows.item(i).rowid,
                      name:res.rows.item(i).name,
                      description:res.rows.item(i).description,
                      date:res.rows.item(i).date,
                      timeStart:res.rows.item(i).timeStart,
                      timeFinish:res.rows.item(i).timeFinish,
                      status:res.rows.item(i).status
                    });

          }
          this.getTasks(items);
        }           
      });
    } else {
      let items = [
        {rowid: "", name: "Чаепитие чемпиона", description: "", timeStart: 840, timeFinish: 870, height: 0 },
        {rowid: "", name: "Зарядка чемпиона", description: "", timeStart: 480, timeFinish: 600, height: 0 },
        {rowid: "", name: "Баеньки чемпион хочет", description: "", timeStart: 900, timeFinish: 1020, height: 0 },
        {rowid: "", name: "Обед чемпиона", description: "", timeStart: 660, timeFinish: 720, height: 0 }
      ];
      this.getTasks(items);
    }


  }

  getTasks(data){
    let min: number = 1440;

    for(let i=0; i<data.length; i++){
      if(min > data[i].timeStart){
        min = data[i].timeStart;
      }
      data[i].timeStart = data[i].timeStart*this.minute;
      data[i].timeFinish = data[i].timeFinish*this.minute;
      data[i].height = data[i].timeFinish - data[i].timeStart;  
      this.arrTasks.push(data[i]);
    }
  }

  addTaskDay(){
    let newTask: Modal  = this.modalCtrl.create('ModalTaskUserDayPage', {});
    newTask.present();
      
    newTask.onDidDismiss((data)=>{
      if(data){
        console.log(data);
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
      name: increased.name,
      description: increased.description,
      date: '',
      timeStart: increased.timeStart,
      timeFinish: increased.timeFinish,
      status: ''
    };
    this.database.insertDataTables('daygr', [objSet.name, objSet.description, objSet.date, objSet.timeStart, objSet.timeFinish, objSet.status  ])
      .then((data) => {
        this.getDataSectionAll();
    });
  }


}
