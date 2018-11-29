import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YearnewtaskComponent } from './yearnewtask/yearnewtask';
@NgModule({
	declarations: [YearnewtaskComponent],
	imports: [
		IonicPageModule.forChild(YearnewtaskComponent),
	],
	exports: [YearnewtaskComponent]
})
export class ComponentsModule {}
