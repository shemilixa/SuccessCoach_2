import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YearnewtaskComponent } from './yearnewtask/yearnewtask';
import { MenuComponent } from './menu/menu';
@NgModule({
	declarations: [YearnewtaskComponent,
    MenuComponent],
	imports: [
		IonicPageModule.forChild(YearnewtaskComponent),
	],
	exports: [YearnewtaskComponent,
    MenuComponent]
})
export class ComponentsModule {}
