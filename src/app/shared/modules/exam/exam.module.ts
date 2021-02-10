import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentExamComponent } from '../../components/student/student-exam/student-exam.component';
import { MaterialModule } from '../material/material.module';
import { ExamService } from '../../services/exam_services/exam.service';
import { LiveExamComponent } from '../../components/student/live-exam/live-exam.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewExamComponent } from '../../components/student/view-exam/view-exam.component';
import {TeacherExamsComponent} from '../../components/teacher-exams/teacher-exams.component'
import {TeacherViewExamComponent} from '../../components/teacher-view-exam/teacher-view-exam.component' 
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [StudentExamComponent, LiveExamComponent, ViewExamComponent,TeacherExamsComponent,TeacherViewExamComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  exports:[
    StudentExamComponent, LiveExamComponent, ViewExamComponent,TeacherExamsComponent,TeacherViewExamComponent
  ],
  providers:[
   ExamService
  ]
})
export class ExamModule { }
