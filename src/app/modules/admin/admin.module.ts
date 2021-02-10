import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { AdminClassComponent } from './components/admin-class/admin-class.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchDeptComponent } from 'src/app/shared/components/branch-dept/branch-dept.component';
import { AddClassComponent } from './components/add-class/add-class.component';
import { InviteClassComponent } from './components/invite-class/invite-class.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { ClassWiseSubjectTeacherComponent } from './components/class-wise-subject-teacher/class-wise-subject-teacher.component';
import { AddClassWiseSubjectTeacherComponent } from './components/add-class-wise-subject-teacher/add-class-wise-subject-teacher.component';
import { StudentsComponent } from './components/students/students.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { AddExamComponent } from './components/add-exam/add-exam.component';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { ExamService } from 'src/app/shared/services/exam_services/exam.service';
import { QuestionViewComponent } from './components/question-view/question-view.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { CanLoadAdminModule } from './admin-module.guard';

@NgModule({
  declarations: [HomeComponent, AdminClassComponent, BranchDeptComponent, AddClassComponent, InviteClassComponent, TeachersComponent, AddTeacherComponent, ClassWiseSubjectTeacherComponent, AddClassWiseSubjectTeacherComponent, StudentsComponent, AddStudentComponent, AddExamComponent, ExamListComponent, QuestionViewComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  exports:[AddExamComponent],
  providers: [
     AdminService, ExamService
  ],
  entryComponents: [
   AddClassComponent, AddTeacherComponent, AddClassWiseSubjectTeacherComponent, AddStudentComponent
  ]
})
export class AdminModule { }
