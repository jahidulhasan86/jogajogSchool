import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ClassComponent } from '../../components/class/class.component';
import { ExamModule } from '../exam/exam.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { ClassLayoutComponent } from '../../components/class-layout/class-layout.component';
import { ClassListComponent } from '../../components/class-list/class-list.component';
import { ChatResourceModule } from '../chat-resource/chat-resource.module';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [ClassComponent, ClassLayoutComponent, ClassListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ExamModule,
    NgxSpinnerModule,    
    ChatResourceModule,
    FormsModule
  ],
  exports:[
    ClassComponent
  ],

  
})
export class ClassModule { }
