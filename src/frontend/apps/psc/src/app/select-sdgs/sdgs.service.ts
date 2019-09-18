import { Injectable } from "@angular/core";

// In  Angular 6 / Rxjs 6 the import is like below
// import { Observable, of } from 'rxjs';

// but in Angular 5.2.x and Rxjs 5x is:
import { Observable } from "rxjs";
import { of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { KMap } from "@colabo-knalledge/f-core/code/knalledge/kMap";
import { KEdge } from "@colabo-knalledge/f-core/code/knalledge/kEdge";
import { KNode } from "@colabo-knalledge/f-core/code/knalledge/kNode";

import { KnalledgeEdgeService } from "@colabo-knalledge/f-store_core/knalledge-edge.service";
import { KnalledgeNodeService } from "@colabo-knalledge/f-store_core/knalledge-node.service";
import { KnalledgeMapService } from "@colabo-knalledge/f-store_core/knalledge-map.service";

import { GlobalEmittersArrayService } from "@colabo-puzzles/f-core/code/puzzles/globalEmitterServicesArray";
import { RimaAAAService } from "@colabo-rima/f-aaa/rima-aaa.service";

import * as config from "@colabo-utils/i-config";

//this consts are defined by INSTALL.MD data:
// const MAP_ID = "5b8a5260f8b8e40f3f250f9d"; //TEF

export const TYPE_SDGS: string = "const.sdgs.sdg";
export const SDG_SELECTION_NAME: string = "UN_SDG";
export const SDG_SELECTION_TYPE: string = "rima.selected_UN_SDG";
export const SDGS_TO_SELECT: number = 3;

enum RequestStatus {
  NOT_INITIATED = "NOT_INITIATED",
  PENDING = "PENDING",
  RECEIVED = "RECEIVED"
}

class Request {
  status: RequestStatus = RequestStatus.NOT_INITIATED;
  response: any;
  data: any;
}

@Injectable()
export class SDGsService {
  sdgsSavedObserver: any = {}; //Observer
  SDGs: any[] = [];
  sdgsLeftSave: number = SDGS_TO_SELECT;
  private _selectedSDGsIDs: string[] = [];
  public get selectedSDGsIDs(): string[] {
    return this._selectedSDGsIDs;
  }
  public set selectedSDGsIDs(value: string[]) {
    this._selectedSDGsIDs = value;
  }

  static mapIdSDGs = config.GetGeneral("mapIdSDGs");
  static mapId = config.GetGeneral("mapId");
  static lang = config.GetGeneral("lang");
  protected mySDGSelections: Request = new Request();

  SDGsMockup: any[] = [
    {
      name: "1. NO POVERTY",
      dataContent: {
        desc:
          "More than 700 million people still live in extreme poverty and are struggling to fulfil the most basic needs like health, education, and access to water and sanitation, to name a few. The overwhelming majority of people living on less than $1.90 a day live in Southern Asia and sub-Saharan Africa. However, this issue also affects developed countries. Right now there are 30 million children growing up poor in the world’s richest countries."
      }
    },
    {
      name: "2. ZERO HUNGER",
      dataContent: {
        desc:
          "A profound change of the global food and agriculture system is needed to nourish today’s 795 million hungry and the additional 2 billion people expected by 2050. Extreme hunger and malnutrition remains a barrier to sustainable development and creates a trap from which people cannot easily escape. Hunger and malnutrition mean less productive individuals, who are more prone to disease and thus often unable to earn more and improve their livelihoods."
      }
    },
    {
      name: "3. GOOD HEALTH AND WELL-BEING",
      dataContent: {
        desc:
          "Мore than 6 million children still die before their fifth birthday every year. 16,000 children die each day from preventable diseases such as measles and tuberculosis. Every day hundreds of women die during pregnancy or from child-birth related complications. In many rural areas, only 56 percent of births are attended by skilled professionals. AIDS is now the leading cause of death among teenagers in sub-Saharan Africa, a region still severely devastated by the HIV epidemic."
      }
    }
  ];

  constructor(
    // private colabowareRFIDService: ColabowareRFIDService,
    private knalledgeEdgeService: KnalledgeEdgeService,
    private knalledgeNodeService: KnalledgeNodeService,
    private knalledgeMapService: KnalledgeMapService,
    private globalEmitterServicesArray: GlobalEmittersArrayService,
    private rimaAAAService: RimaAAAService
  ) {
    //getting data for the user:
    //this.globalEmitterServicesArray.get(this.colabowareIDProvided).subscribe('UsersProfilingComponent.user', this.coLaboWareProvidedData.bind(this));
    this.init();
  }

  init(): void {
    console.log("sDGsService.init");
  }

  createNewNodeWithEdge(
    newNode: KNode,
    newEdge: KEdge,
    parentNodeId: string,
    listener
  ) {
    newNode.iAmId = "556760847125996dc1a4a24f";
    newNode.visual = {};
    newEdge.iAmId = "556760847125996dc1a4a24f";
    newEdge.visual = {};

    //TODO: iAmId, createdAt, updatedAt
    this.knalledgeNodeService
      .create(newNode)
      .subscribe(newNodeCreated.bind(this));

    // callback after the new user is created
    function newNodeCreated(newNode: KNode): void {
      console.log("newUserCreated", newNode);
      this.activeUser = newNode;
      //this.nodes.push(newNode);

      newEdge.sourceId = parentNodeId;
      newEdge.targetId = newNode._id;
      newEdge.mapId = SDGsService.mapId;
      //TODO: iAmId, createdAt, updatedAt
      this.knalledgeEdgeService
        .create(newEdge)
        .subscribe(newEdgeCreated.bind(this));

      // callback after an edge to the new node is created
      function newEdgeCreated(newEdge: KEdge): void {
        console.log("newEdgeCreated", newEdge);
        listener(newNode, newEdge);
        //this.edges.push(newEdge);
      }
    }
  }

  /*
  TO MOVE into some AppService or InitService or ....
    gets initial data for the app to work:
    - SDGs
    TODO: - user data
  */
  getAppData(): void {
    //var map:KNode = new KNode();
    // this.heroService.getHero(id)
    //   .subscribe(hero => this.hero = hero);
    //this.node =
    this.getSDGs();
    // this.knalledgeEdgeService.queryInMap(SDGsService.mapId)
    //   .subscribe(edges => this.edgesReceived(edges)); //as KNode
  }

  //loadSDGs():void{
  getSDGs(): Observable<any[]> {
    //return of(this.SDGsMockup);
    return this.knalledgeNodeService
      .queryInMapofType(SDGsService.mapIdSDGs, TYPE_SDGS)
      .pipe(
        map(nodes => this.localize(nodes)),
        //.subscribe(nodes => this.sdgsReceived(nodes)); //as KNode}
        tap(nodes => this.sdgsReceived(nodes))
      );
  }

  protected sdgsReceived(SDGs: Array<KNode>): void {
    // this.nodes = SDGs.data;
    //this.nodes.fill(SDGs); //this.nodes = SDGs.data;
    //this.nodes.name = 'test';
    this.SDGs = SDGs;
    // console.log('[sdgsReceived] this.SDGs: ', this.SDGs);

    // this.users = [];
    // this.extractNodesOfType(KNode.TYPE_USER, this.users);
    //
    // this.tagsGroups = [];
    // this.extractNodesOfType(KNode.TYPE_TAGS_GROUP, this.tagsGroups);
    // this.tags = [];
    // this.extractNodesOfType(KNode.TYPE_TAG, this.tags);
    // this.groups = [];
    // this.extractNodesOfType(KNode.TYPE_USERS_GROUP, this.groups);
  }

  localizeObj(obj: any, objLoc: any) {
    for (let prm in objLoc) {
      if (typeof objLoc[prm] === "object") {
        this.localizeObj(obj[prm], objLoc[prm]);
        //TODO:obj['dataContent']['goal'] = objLoc['dataContent']['goal']
      } else {
        obj[prm] = objLoc[prm];
      }
    }
  }

  localize(nodes: any, lang?: string): any[] {
    if (lang === null || lang === undefined) {
      lang = SDGsService.lang;
    }
    for (var i: number = 0; i < nodes.length; i++) {
      let node: KNode = nodes[i];
      if ("i18n" in node && lang in node["i18n"]) {
        this.localizeObj(node, node["i18n"][lang]);
      } else {
        console.log("localize:: lang <" + lang + "> not supported");
      }
    }
    //TODO: delete the i18n object?
    return nodes;
  }

  getMySDGSelections(forceRefresh: boolean = false): Observable<any[]> {
    if (
      forceRefresh ||
      this.mySDGSelections.status !== RequestStatus.RECEIVED
    ) {
      if (this.mySDGSelections.status !== RequestStatus.PENDING) {
        this.mySDGSelections.status = RequestStatus.PENDING;
        this.mySDGSelections.response = this.knalledgeEdgeService
          .queryForMapTypeUserWTargetNodes(
            SDGsService.mapId,
            SDG_SELECTION_TYPE,
            this.rimaAAAService.getUserId()
          )
          .pipe(
            tap(() => (this.mySDGSelections.status = RequestStatus.RECEIVED)),
            tap(edges => this.mySDGSelectionsReceived(edges))
          );
      }
      return this.mySDGSelections.response;
    } else {
      return of(this.selectedSDGsIDs);
    }
  }

  protected mySDGSelectionsReceived(edges: KEdge[]): void {
    console.log("[mySDGSelectionsReceived] edges:", edges);
    this._selectedSDGsIDs = [];
    if (edges && edges.length) {
      for (var e: number = 0; e < edges.length; e++) {
        this._selectedSDGsIDs.push((edges[e].targetId as any)._id);
      }
    }
  }

  isSdgSelected(sdgId: string): boolean {
    return this._selectedSDGsIDs.indexOf(sdgId) !== -1;
  }

  changeSDGsSelectionState(state: boolean, id: string): void {
    console.log("changeSDGsSelectionState", state, id);
    if (state) {
      this._selectedSDGsIDs.push(id);
    } else {
      let index = this._selectedSDGsIDs.indexOf(id);
      if (index !== -1) this._selectedSDGsIDs.splice(index, 1);
    }
    console.log(this._selectedSDGsIDs.toString());
  }

  // getSDGSSelectedByUser(iAmId:string):void{
  //   this.knalledgeNodeService.queryInMapofTypeForUser(SDGsService.mapId, SDG_SELECTION_TYPE, this.rimaAAAService.getUserId)
  // }
  //
  // getSDGSSelected(iAmId:string):void{
  //   this.knalledgeNodeService.queryInMapofType(SDGsService.mapId, SDG_SELECTION_TYPE)
  // }

  saveSDGsSelection(sdgs: string[]): Observable<any> {
    let user_id: string = this.rimaAAAService.getUserId();
    let sdgId: string;
    this.sdgsLeftSave = sdgs.length;
    let that = this;
    this.knalledgeEdgeService
      .destroyByTypeByUser(SDG_SELECTION_TYPE, user_id)
      .subscribe(function() {
        for (var i in sdgs) {
          sdgId = sdgs[i];
          console.log(sdgId);
          let sdgSelection: KEdge = new KEdge();
          sdgSelection.sourceId = user_id;
          sdgSelection.targetId = sdgId;
          sdgSelection.iAmId = user_id;
          sdgSelection.mapId = SDGsService.mapId;
          sdgSelection.name = SDG_SELECTION_NAME;
          sdgSelection.type = SDG_SELECTION_TYPE;
          that.knalledgeEdgeService
            .create(sdgSelection)
            .subscribe(that.sdgSaved.bind(that));
        }
      });
    // https://angular.io/guide/observables
    return new Observable(this.sdgsSavedSubscriber.bind(this));
  }

  //could be done as anonymous, but we made it this way to be more clear the logic of Oberver
  sdgsSavedSubscriber(observer) {
    //:Observer) {
    console.log("sdgsSavedSubscriber");
    this.sdgsSavedObserver = observer;
    return { unsubscribe() {} };
  }

  sdgSaved(data: any): void {
    this.sdgsLeftSave--;
    console.log("SDGsService::sdgSaved:", this.sdgsLeftSave, data);
    if (this.sdgsLeftSave === 0) {
      console.log("SDGsService::ALL sdgSaved");

      //emitting Obstacle:
      this.sdgsSavedObserver.next(1); //TODO change value
      this.sdgsSavedObserver.complete();
    }
  }

  //getSDGs():Observable<KNode[]>{
  // getSDGs():any[]{
  //   return this.SDGs;
  // }
}
