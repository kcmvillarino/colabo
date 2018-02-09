import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule }    from '@angular/common/http';

import {KnalledgeEdgeService} from '@colabo-knalledge/knalledge_store_core/knalledge-edge.service';
import {KnalledgeNodeService} from '@colabo-knalledge/knalledge_store_core/knalledge-node.service';
import {KnalledgeMapService} from '@colabo-knalledge/knalledge_store_core/knalledge-map.service';

import { AppComponent } from './app.component';
import { GetNodeComponent } from './get-node/get-node.component';
import { GetMapComponent } from './get-map/get-map.component';


var apiUrl = 'http://fdbsun1.cs.umu.se:3030/demo3models/query';
// var apiUrl = 'http://dbpedia.org/sparql';
@NgModule({
  declarations: [
    AppComponent,
    GetNodeComponent,
    GetMapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [KnalledgeEdgeService, KnalledgeNodeService, KnalledgeMapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }