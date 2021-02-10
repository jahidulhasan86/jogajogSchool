import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatResourceModule } from '../chat-resource/chat-resource.module';
import { CallComponent } from '../../components/call/call.component';
import { CallLayoutComponent } from '../../components/call-layout/call-layout.component';
;  
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '../material/material.module';


@NgModule({
    declarations: [CallComponent,CallLayoutComponent],
    imports: [
      ChatResourceModule,
      CommonModule,
      MaterialModule
     
    ],
    exports: [CallComponent,CallLayoutComponent
    ]
  })
  export class CallModule { }