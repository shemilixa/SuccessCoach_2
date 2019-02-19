import { Component, Output, EventEmitter  } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {
	@Output() userDate = new EventEmitter<any>();
	public platform: string;
	public arrBusyDays: any = {};

	date: any;
	daysInThisMonth: any;
	daysInLastMonth: any;
	daysInNextMonth: any;
	monthNamesEN: string[];
	monthNamesRU: string[];
	currentMonthNumber: any;
	currentMonth: any;
	currentYear: any;
	currentDate: any;
	weekDay: string[] = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
	selectDateDay: string;
	selectDateMonth: string;

	constructor(
		private database: DatabaseProvider,		
		public plt: Platform
		) {
	    if(plt.is('cordova')){
	      //если телефон
	      this.platform = 'cordova';
	    }

		this.date = new Date();
    	this.monthNamesEN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    	this.monthNamesRU = ["Январь","Феврать","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    	this.getDaysOfMonth();
    	

	}

	getDaysOfMonth() {
		this.daysInThisMonth = new Array();
		this.daysInLastMonth = new Array();
		this.daysInNextMonth = new Array();

		this.currentMonthNumber = this.date.getMonth();
		this.currentMonth = this.monthNamesRU[this.date.getMonth()];
		this.currentYear = this.date.getFullYear();
		if(this.date.getMonth() === new Date().getMonth()) {
		  this.currentDate = new Date().getDate();
		} else {
		  this.currentDate = 999;
		}

		var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
		var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
		for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
		  this.daysInLastMonth.push(i);
		}

		var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
		for (var j = 0; j < thisNumOfDays; j++) {
		  this.daysInThisMonth.push(j+1);
		}

		var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
		// var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
		for (var k = 0; k < (6-lastDayThisMonth); k++) {
		  this.daysInNextMonth.push(k+1);
		}
		var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
		if(totalDays<36) {
		  for(var l = (7-lastDayThisMonth); l < ((7-lastDayThisMonth)+7); l++) {
		    this.daysInNextMonth.push(l);
		  }
		}
		this.getBusyDays();
	}

	goToLastMonth() {
		this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
		this.getDaysOfMonth();	
		this.getBusyDays();	
	}

	goToNextMonth() {
		this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
		this.getDaysOfMonth();
		this.getBusyDays();
	}

	listCalendar(e){
		this.arrBusyDays = [];		
		if(e.deltaX < -15){	     	
	     	this.goToNextMonth();
	    }
	    if(e.deltaX > 15){
	      	this.goToLastMonth();
	    }
	}

	selectDay(e, day, month){
		this.selectDateDay = day;
		this.selectDateMonth = month;		

		if(String(Number(this.date.getMonth()+1)).length == 1){
			month = "0"+String(Number(this.date.getMonth()+1));
		} else {
			month = String(Number(this.date.getMonth()+1));
		}

		if(String(day).length == 1){
			day = "0"+String(day);
		} else {
			day = String(day);
		}

		let selectDate = {
			year: this.currentYear,
			month: month,
			day: day,
			event: e
		};
		this.userDate.emit(selectDate);	
	}

	getBusyDays(){
		
		let month: string;
		if(String(this.date.getMonth()+1).length>1){
			month = String(this.date.getMonth()+1);			
		} else {
			month = '0'+String(this.date.getMonth()+1);
		}

	

		let curentDate = String(this.currentYear)+String(this.date.getMonth()+1)+String(this.currentDate);
		if(this.platform == 'cordova'){
	      let option = ' WHERE date>='+String(this.date.getFullYear())+month+'00 AND date<='+String(this.date.getFullYear())+month+'31 GROUP BY date';
	      this.database.getDataAll('daygr', option)
	      .then(res => {
	        if(res.rows.length>0) { 
	          	for(var i=0; i<res.rows.length; i++) {
	          		let dd = String(res.rows.item(i).date);
	          		dd = dd.slice(6, dd.length);		          		
	          		if(curentDate<res.rows.item(i).date){
	          			this.arrBusyDays[dd] = 'busyDay';           		
	          		} else {
	          			this.arrBusyDays[dd] = 'busyDayPast';
	          		}
	          	}	      	
	        } else {
	          //this.arrTasks = [];
	        }          
	      });
	    } else {

	    }
	}




  	

}
