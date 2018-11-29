import { Component } from '@angular/core';

/**
 * Generated class for the YearnewtaskComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'yearnewtask',
  templateUrl: 'yearnewtask.html'
})
export class YearnewtaskComponent {

  constructor() {

  }

  closeTask(){
  	//document.getElementById('bakgroundmodal').style.width="0";
  	document.getElementById('modaladdtask').style.display="none";
  	console.log();
  }



}
