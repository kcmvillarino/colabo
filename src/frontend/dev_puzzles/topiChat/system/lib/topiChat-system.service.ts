import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {TopiChatCoreService, TopiChatPackage} from '@colabo-topiChat/core';
import {ColaboPubSubPlugin, ColaboPubSub} from '@colabo-utils/pub-sub';

export {TopiChatPackage, ColaboPubSubPlugin};

export enum TopiChatSystemEvents{
	ChatInit = 'tc:chat-init',
	ChatMessage = 'tc:chat-message'
}

@Injectable()
export class TopiChatSystemService{

  protected serverPubSub: ColaboPubSub;
  protected _isActive:boolean = true;

  constructor(
    protected topiChatCoreService:TopiChatCoreService
    ) {
      this.init();
  }

  /**
    * Initializes service
    */
  init() {
      if(!this._isActive) return;

      // called on init message
      function chatInit(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatSystemService:chatInit] Client id: %s', tcPackage.clientIdReciever);
          this.clientInfo.clientId = tcPackage.clientIdReciever;
      }
      // called on helo message
      function clientMessage(eventName, msg, tcPackage:TopiChatPackage) {
          console.log('[TopiChatSystemService:clientMessage] Client id: %s', tcPackage.clientIdReciever);
          console.log('\t msg: %s', JSON.stringify(tcPackage.msg));
      }

      // registering chat plugin
      let chatPluginOptions:any = {
          name: "topiChat-talk",
          events: {}
      };
      chatPluginOptions.events[TopiChatSystemEvents.ChatInit] = chatInit.bind(this);
      chatPluginOptions.events[TopiChatSystemEvents.ChatMessage] = clientMessage.bind(this);
      this.topiChatCoreService.registerPlugin(chatPluginOptions);

      var msg:any =     {
        meta: {
          timestamp: Math.floor(new Date().getTime() / 1000),
        },
        from: {
          name: "Colabo"
        },
        content: {
          text: "(Init) Hello from client!"
        }
      };

      this.topiChatCoreService.emit(TopiChatSystemEvents.ChatMessage, msg);
  }

  /**
    * Emits message through the eventName
    * @param  {string} eventName [description]
    * @param  {Object} msg - message to be sent
    * @return {TopiChatSystemService}
    */
  emit(eventName, msg, clientIdReciever?:string) {
    this.topiChatCoreService.emit(eventName, msg, clientIdReciever);
  }

  registerPlugin(pluginOptions:ColaboPubSubPlugin){
    this.topiChatCoreService.registerPlugin(pluginOptions);
  }
}