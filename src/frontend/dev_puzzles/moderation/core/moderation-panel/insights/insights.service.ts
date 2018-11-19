import { Injectable } from '@angular/core';
// import {ColaboFlowState, ColaboFlowStates} from './colaboFlowState';
// import {MyColaboFlowState, MyColaboFlowStates} from './myColaboFlowState';

import { RimaAAAService } from '@colabo-rima/f-aaa/rima-aaa.service';
import {ColaboFlowService} from '@colabo-flow/f-core/lib/colabo-flow.service';
import {KnalledgeNodeService} from '@colabo-knalledge/f-store_core/knalledge-node.service';
import {KnalledgeEdgeService} from '@colabo-knalledge/f-store_core/knalledge-edge.service';
// import {KnalledgeSearchService} from '@colabo-knalledge/f-search';
import {KNode} from '@colabo-knalledge/f-core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/f-core/code/knalledge/kEdge';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import * as config from '@colabo-utils/i-config';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {

  static mapId = config.GetGeneral('mapId');

  static TOPICHAT_MSG_TYPE:string = 'topiChat.talk.chatMsg';
  cardsPlayed:KNode[][] = new Array<Array<KNode>>(); //first dimension are rounds, second are all cards in that round
  registeredUsers:KNode[] = [];
  myCfStates:KNode[] = [];
  cwcs:KNode[] = [];
  selectedSDGs:KEdge[] = [];

  constructor(
    private knalledgeNodeService:KnalledgeNodeService,
    private knalledgeEdgeService:KnalledgeEdgeService,
    private colaboFlowService:ColaboFlowService,
    private rimaAAAService: RimaAAAService
  ) {
  }

  /**
  ** TODO: should migrate to SDGService
  */
  getSelectedSDGs(forceRefresh:boolean = false){
    // let result:Observable<KNode[]> ;
    //
    // if(forceRefresh || this.selectedSDGs.length == 0){
    //   result = this.knalledgeEdgeService.queryInMapofTypeAndContentData(InsightsService.mapId, InsightsService.TOPICHAT_MSG_TYPE, "dialoGameReponse.playRound", round)
    //   .pipe(
    //     tap(nodesFromServer => this.assignCardsPlayedInTheRound(round, nodesFromServer))
    //   );
    //   return result;
    // }
    // else{
    //   if(typeof this.cardsPlayed[round] === 'undefined'){this.cardsPlayed[round] = []}
    //   return of(this.cardsPlayed[round]);
    // }
  }

  getRegisteredUsers(forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]>;

    if(forceRefresh || this.registeredUsers.length == 0){
      result = this.rimaAAAService.getRegisteredUsers(InsightsService.mapId)
      .pipe(
        tap(nodesFromServer => this.assignRegisteredUsers(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.registeredUsers);
    }
  }

  assignRegisteredUsers(users:any):void{
    console.log('assignRegisteredUsers', users);
    this.registeredUsers = users;
  }

  getCWCs(forceRefresh:boolean = true):Observable<KNode[]>{
   let result:Observable<KNode[]> ;

   if(forceRefresh || this.cwcs.length == 0){
     result = this.knalledgeNodeService.queryInMapofType(InsightsService.mapId, InsightsService.TOPICHAT_MSG_TYPE)
     .pipe(
       tap(nodesFromServer => this.assignCWCs(nodesFromServer))
     );
     return result;
   }
   else{
     return of(this.cwcs);
   }
 }

 assignCWCs(cwcs:any):void{
   this.cwcs = cwcs;
 }


 getCardsPlayed(forceRefresh:boolean = true):Observable<any>{
  let result:Observable<KNode[]> ;

  if(forceRefresh || this.cardsPlayed.length == 0){
    result = this.knalledgeNodeService.queryInMapofType(InsightsService.mapId, InsightsService.TOPICHAT_MSG_TYPE)
    .pipe(
      tap(nodesFromServer => this.assignCardsPlayed(nodesFromServer))
    );
    return result;
  }
  else{
    return of(this.cardsPlayed);
  }
}

 getCardsPlayedInTheRound(round:number, forceRefresh:boolean = false):Observable<KNode[]>{
    let result:Observable<KNode[]> ;

    if(forceRefresh || this.cardsPlayed.length == 0 || (typeof this.cardsPlayed[round] === 'undefined') || this.cardsPlayed[round].length == 0){
      result = this.knalledgeNodeService.queryInMapofTypeAndContentData(InsightsService.mapId, InsightsService.TOPICHAT_MSG_TYPE, "dialoGameReponse.playRound", round)
      .pipe(
        tap(nodesFromServer => this.assignCardsPlayedInTheRound(round, nodesFromServer))
      );
      return result;
    }
    else{
      if(typeof this.cardsPlayed[round] === 'undefined'){this.cardsPlayed[round] = []}
      return of(this.cardsPlayed[round]);
    }
  }

  getMyCFStatesForAllUsers(forceRefresh:boolean = true):Observable<KNode[]>{
    let result:Observable<KNode[]> ;

    if(forceRefresh || this.myCfStates.length == 0){
      result = this.knalledgeNodeService.queryInMapofType(ColaboFlowService.mapId, ColaboFlowService.MY_COLABO_FLOW_STATE_TYPE)
      .pipe(
        tap(nodesFromServer => this.assignMyCFStatesForAllUsers(nodesFromServer))
      );
      return result;
    }
    else{
      return of(this.myCfStates);
    }
  }

  assignMyCFStatesForAllUsers(cfStateNodes:KNode[]):void{
    this.myCfStates = cfStateNodes;
  }

  /*
    be aware that this method will reaturn false also in the case when users are not loaded yet
  */
  hasUserPlayedInTheRound(userId:string, round:number):boolean{
    if(typeof this.cardsPlayed[round] === 'undefined'){return false;}

    for(var i:number = 0; i<this.cardsPlayed[round].length;i++){
      if(this.cardsPlayed[round][i].iAmId == userId){
        return true;
      }
    }
    return false;
  }

  isCwcPlayed(cwc:KNode):boolean{
    return 'dataContent' in cwc && 'dialoGameReponse' in cwc.dataContent && 'playRound' in cwc.dataContent.dialoGameReponse;
  }

  roundPlayed(cwc:KNode):number{
    return ('dataContent' in cwc && 'dialoGameReponse' in cwc.dataContent && 'playRound' in cwc.dataContent.dialoGameReponse) ? cwc.dataContent.dialoGameReponse.playRound : null;
  }
  
  cardHumanIdPlayedInTheRound(userId:string, round:number):KNode{
    if(typeof this.cardsPlayed[round] === 'undefined'){return null;}

    for(var i:number = 0; i<this.cardsPlayed[round].length;i++){
      if(this.cardsPlayed[round][i].iAmId == userId){
        return ('dataContent' in this.cardsPlayed[round][i]) ? this.cardsPlayed[round][i] : null;
      }
    }
    return null;
  }

  assignCardsPlayedInTheRound(round:number, cards:any):void{
    console.log('assignCardsPlayedInTheCurrentRound', round, cards);
    if(typeof this.cardsPlayed[round] === 'undefined'){this.cardsPlayed[round] = []}
    this.cardsPlayed[round] = cards;
  }

  assignCardsPlayed(cardsN:any):void{
    let cards:KNode[] = cardsN as KNode[];
    console.log('assignCardsPlayed', cards);
    let round:number;
    for(var i:number = 0; i<cards.length;i++){
      if('dialoGameReponse' in cards[i].dataContent){
        round = cards[i].dataContent.dialoGameReponse.playRound;
        if(typeof this.cardsPlayed[round] === 'undefined'){this.cardsPlayed[round] = []}
        this.cardsPlayed[round].push(cards[i]);
      }
    }
  }
}
