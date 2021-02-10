import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentLayoutComponent } from 'src/app/layouts/student/student-layout/student-layout.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { StudentSideNavComponent } from 'src/app/layouts/student/student-side-nav/student-side-nav.component';
import { ClassModule } from 'src/app/shared/modules/class/class.module';
import { HttpClientModule } from '@angular/common/http';
import { SubjectTeacherService } from 'src/app/shared/services/subject-teacher/subject-teacher.service';
import { FormsModule } from '@angular/forms';
import { UserModule } from 'src/app/shared/modules/user/user.module';
import { StudentService } from 'src/app/shared/services/student_service/student.service';
import { TeacherService } from 'src/app/shared/services/teacher_service/teacher.service';
import { RecentModule } from 'src/app/shared/modules/recent/recent.module';
import { CallModule } from 'src/app/shared/modules/call/call.module';
import { WaitForHostComponent } from './wait-for-host/wait-for-host.component';


@NgModule({
  declarations: [WaitForHostComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MaterialModule,
    HttpClientModule,
    ClassModule,
    FormsModule,
    UserModule,
    RecentModule,
    CallModule,
    RecentModule
  ],
  providers: [
    SubjectTeacherService
  ],
})
export class StudentModule { }
