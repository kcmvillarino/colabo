import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { ViewNodePageComponent } from '@colabo-knalledge/f-view_node/view-node-page/view-node-page.component';
import { GetMapComponent } from './get-map/get-map.component';

const routes: Routes = [
  // default route
  {
    path: '',
    redirectTo: '/node',
    pathMatch: 'full'
  },
  {
    path: 'node',
    component: ViewNodePageComponent
  },
  // same route but with the nodeId provided
  {
    path: 'node/id/:nodeId',
    component: ViewNodePageComponent
  },
  {
    path: 'map',
    component: GetMapComponent
  },
  // same route but with the mapId provided
  {
    path: 'map/id/:mapId',
    component: GetMapComponent
  },
  {
    path: 'maps',
    component: GetMapComponent
  }
];

@NgModule({
  exports: [
    // makes router directives available for use in
    // other components that will need them
    RouterModule
  ],
  imports: [
    // initialize RouterModule with routes
    RouterModule.forRoot(routes)
  ]
})

export class AppRoutingModule { }