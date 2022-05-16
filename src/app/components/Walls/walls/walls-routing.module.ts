import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WallsPage } from './walls.page';

const routes: Routes = [
  {
    path: '',
    component: WallsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallsPageRoutingModule {}
