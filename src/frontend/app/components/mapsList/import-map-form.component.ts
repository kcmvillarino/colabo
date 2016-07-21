import {CORE_DIRECTIVES, NgClass, NgStyle} from '@angular/common';

//import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';

import {NgForm, FORM_DIRECTIVES} from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {MATERIAL_DIRECTIVES, Media} from "ng2-material";
//import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {MdDialog} from "ng2-material";

declare var knalledge;

// const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'import-map-form',
  moduleId: module.id,
  templateUrl: 'partials/import-map-form.component.tpl.html',
  providers: [
      // MATERIAL_PROVIDERS,
//      OVERLAY_PROVIDERS
  ],
  directives: [
      MATERIAL_DIRECTIVES,
      MD_INPUT_DIRECTIVES,

      //FILE_UPLOAD_DIRECTIVES,
  ]
})
export class ImportMapFormComponent {
  public importMapFormActive = true;
  public giveNewName:boolean = false;
  public mapName:string = "";
  model = new knalledge.KMap();

  //public uploader:FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;


  private creatingFunction:Function=null;

  @ViewChild(MdDialog) private mdDialog:MdDialog;

  onSubmit() {
    console.log('[onSubmit]');
    this.mdDialog.close();
    if(this.creatingFunction){
      this.creatingFunction(true);
    }
  }
  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  // get debugging(){
  //   return
  // }
  //

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  show(creatingFunction:Function){
    console.log("[ImportMapFormComponent].show");
    this.creatingFunction = creatingFunction;
    this.mdDialog.show();
    this.importMapFormActive = false;
    setTimeout(() => this.importMapFormActive = true, 0.1);
    //this.model = map;
  }

  close(confirm){
    console.log("[ImportMapFormComponent].close:",confirm);
    this.mdDialog.close();
    if(this.creatingFunction){
      this.creatingFunction(false);
    }
  }

  giveNewNameChanged(event){
    if(!event){
      this.mapName = "";
    }
  }
}