import { Component, OnInit } from '@angular/core';
import { CoLaboWareType } from '@colabo-colaboware/colaboware_core/coLaboWareData';
import { CoLaboWareData } from '@colabo-colaboware/colaboware_core/coLaboWareData';

@Component({
  selector: 'app-users-profiling',
  templateUrl: './users-profiling.component.html',
  styleUrls: ['./users-profiling.component.css']
})
export class UsersProfilingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  profileNewUser():void
  {
    console.log('profileNewUser');
  }

  inputUserProfile():void{

  }

  sendDemoColabowareInput():void{
      let cwData = new CoLaboWareData();
      cwData.type = CoLaboWareType.RFID;
      cwData.value = '0009610521';
      this.colabowareInput(cwData);
  }

  colabowareInput(cwData:CoLaboWareData){
    if(cwData.type === CoLaboWareType.RFID){
        console.log('cwData:'+cwData.value);
    }
  }

}
