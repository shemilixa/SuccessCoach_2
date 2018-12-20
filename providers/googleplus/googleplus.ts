import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { SynchronizationProvider } from '../synchronization/synchronization';



@Injectable()
export class GoogleplusProvider {

	public platform: string;
	public userGoogle: any;

  	constructor(
  	  	public plt: Platform,
  	  	private googlePlus: GooglePlus,
    	private http: HTTP,
    	public synchronization: SynchronizationProvider
  	) {

	  	if(plt.is('cordova')){
	  		//если телефон
	  		this.platform = 'cordova';
	  	}
	}

	connect(){
		if(this.platform == 'cordova'){
			this.googlePlus.trySilentLogin({})
			.then(googleUser => {
				this.userGoogle = googleUser;
				this.synchronization.usersToServer(googleUser);
			})
			.catch(error => {
				this.googlePlus.login({})
				  .then(googleUser => {
				  	this.userGoogle = googleUser;
					this.synchronization.usersToServer(googleUser);
				})
			});
		}
	}

	

/*    usersToServer(googleUser){
	    let headers = {
	        'Content-Type': 'application/json'
	    };

	    let url = "http://success-coach.ru/modules/users/";
		this.http.post(url, googleUser, headers)
		    .then(data => {
		      console.log(data);
		    })
		    .catch(error => {
		      console.log(error);
		      
		});
	}

*/


    /*moduleOperationOnServer(module, operation, arData){
    	if(this.platform == 'cordova'){
		    let headers = {
		        'Content-Type': 'application/json'
		    };

		    let url = "http://success-coach.ru/modules/"+module+"/";
		    this.http.post(url, {user: this.userGoogle.userId, operation: operation, data: arData}, headers)
		    .then(data => {
		      console.log(data);
		    })
		    .catch(error => {
		      console.log(error);
		      
		    });
		}
  	}


  	synchronizationServer(){
  		let items: any = [];
  		let option = ' WHERE clone<>1';
	    this.database.getDataAll('daygr', option)
	      .then(res => {
	        if(res.rows.length>0) { 
	          
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

	          console.log(items);

	        }         
	    });

  	}*/

}
