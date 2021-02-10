import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentLayoutComponent } from '../../components/recent-layout/recent-layout.component';
import { RecentListComponent } from '../../components/recent-list/recent-list.component';
import { MaterialModule } from '../material/material.module';
import { ChatResourceModule } from '../chat-resource/chat-resource.module';
import { FormsModule } from '@angular/forms';
import { UserModule } from '../user/user.module';



@NgModule({
  declarations: [RecentLayoutComponent, RecentListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ChatResourceModule,
    FormsModule,
    UserModule
  ],
  exports:[
    RecentLayoutComponent, RecentListComponent
  ],
})
export class RecentModule { }
