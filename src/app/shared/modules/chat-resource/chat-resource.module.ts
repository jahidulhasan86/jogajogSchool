import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChattingComponent } from '../../components/chatting/chatting.component';
import { SharedResourceComponent } from '../../components/shared-resource/shared-resource.component';
import { MaterialModule } from '../material/material.module';
import { ChatResourceLayoutComponent } from '../../components/chat-resource-layout/chat-resource-layout.component';
import { ResourceListComponent } from '../../components/resource-list/resource-list.component';
import { ChatResourceLayoutStandaloneComponent } from '../../components/chat-resource-layout-standalone/chat-resource-layout-standalone.component';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';
import { GlobalService } from '../../services/global/global.service';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [ChatResourceLayoutComponent, ChattingComponent, SharedResourceComponent, ResourceListComponent, ChatResourceLayoutStandaloneComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    ChattingComponent,
    SharedResourceComponent,
    ChatResourceLayoutComponent,
    ResourceListComponent,
    ChatResourceLayoutStandaloneComponent
  ],
  providers: [
    XmppChatService,
    GlobalService
	],
})
export class ChatResourceModule { }
