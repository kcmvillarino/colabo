const MODULE_NAME: string = "@colabo-flow/f-audit";

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { AuditedAction } from '@colabo-flow/i-audit';

@Injectable()
export class ColaboFlowAuditService{

  protected _isActive:boolean = true;

  constructor(
    ) {
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
    if(!this._isActive) return;

    // initialize 
  }
  
  getItems():AuditedAction[]{
    let items:AuditedAction[] = [];
    items.push(({
      _id: "ad30",
      name: "start",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    items.push(({
      _id: "ad31",
      name: "parseRequest",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    items.push(({
      _id: "ad32",
      name: "parseResponse",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    items.push(({
      _id: "ad3a",
      name: "end",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff01"
    }) as AuditedAction);

    // flow ff02
    items.push(({
      _id: "ad40",
      name: "start",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    items.push(({
      _id: "ad41",
      name: "parseRequest",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    items.push(({
      _id: "ad42",
      name: "parseResponse",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    items.push(({
      _id: "ad4a",
      name: "end",
      flowId: "searchSoundsNoCache",
      flowInstanceId: "ff02"
    }) as AuditedAction);

    // flow ff03
    items.push(({
      _id: "ad50",
      name: "start",
      flowId: "searchSoundsWithCache",
      flowInstanceId: "ff03"
    }) as AuditedAction);

    items.push(({
      _id: "ad50",
      name: "parseRequest",
      flowId: "searchSoundsWithCache",
      flowInstanceId: "ff03"
    }) as AuditedAction);
    return items;

    items.push(({
      _id: "ad5a",
      name: "end",
      flowId: "searchSoundsWithCache",
      flowInstanceId: "ff03"
    }) as AuditedAction);

  }
}
