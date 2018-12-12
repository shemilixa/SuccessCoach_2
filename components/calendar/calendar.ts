import { Component, Output, EventEmitter  } from '@angular/core';


@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})
export class CalendarComponent {
	@Output() userDate = new EventEmitter<any>();

	date: any;
	daysInThisMonth: any;
	daysInLastMonth: any;
	daysInNextMonth: any;
	monthNamesEN: string[];
	monthNamesRU: string[];
	currentMonth: any;
	currentYear: any;
	currentDate: any;
	weekDay: string[] = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

	constructor() {
		this.date = new Date();
    	this.monthNamesEN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    	this.monthNamesRU = ["Январь","Феврать","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
    	this.getDaysOfMonth();

	}

	getDaysOfMonth() {
		this.daysInThisMonth = new Array();
		this.daysInLastMonth = new Array();
		this.daysInNextMonth = new Array();
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
	}

	goToLastMonth() {
		this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
		this.getDaysOfMonth();
	}

	goToNextMonth() {
		this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
		this.getDaysOfMonth();
	}

	listCalendar(e){
		if(e.deltaX < -15){	     	
	     	this.goToNextMonth();
	    }
	    if(e.deltaX > 15){
	      	this.goToLastMonth();
	    }
	}

	selectDay(e, day){
		let selectDate = {
			year: this.currentYear,
			month: Number(this.date.getMonth()+1),
			day: day,
			event: e
		};
		this.userDate.emit(selectDate);	
	}


  	

}
