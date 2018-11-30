import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {
	@Input() menuobj: any;

  constructor(public navCtrl: NavController) {

  }

  gotoPage(url){
  	this.closemenu();	
		if(this.navCtrl.getActive().id == url){
			this.navCtrl.pop();
		}		
    this.navCtrl.push(url, {menu: this.menuobj} );
  }

  closemenu(){
		document.getElementById('modalmenu').style.display="none";
		document.getElementById('bgroundfull').style.display="none";
	}

}
