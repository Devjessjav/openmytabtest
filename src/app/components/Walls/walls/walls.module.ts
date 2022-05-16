import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WallsPageRoutingModule } from './walls-routing.module';

import { WallsPage } from './walls.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WallsPageRoutingModule
  ],
  declarations: [WallsPage]
})
export class WallsPageModule {}
