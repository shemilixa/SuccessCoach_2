import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'yearnewtask',
  templateUrl: 'yearnewtask.html'
})
export class YearnewtaskComponent {
	@Input() sfer: any;
	public name: string;
	public description: string;
	public selectSfer: number;

	@Output() onChanged = new EventEmitter<any>();

	constructor() {
	}

	closeTask(){
		this.name='';
		this.description='';
		this.selectSfer=0;
		document.getElementById('modaladdtask').style.display="none";
	}

	createTask(){
		let obj = {
			idgroup: this.selectSfer,
			name: this.name,
			description: this.description
		};
		this.onChanged.emit(obj);
		this.closeTask();
	}



}
