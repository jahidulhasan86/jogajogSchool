import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorLayoutComponent } from 'src/app/layouts/instructor/instructor-layout/instructor-layout.component';
import { HeaderComponent } from 'src/app/layouts/shared/header/header.component';
import { FooterComponent } from 'src/app/layouts/shared/footer/footer.component';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { InstructorSideNavComponent } from 'src/app/layouts/instructor/instructor-side-nav/instructor-side-nav.component';
import { InstructorTeacherComponent } from './components/instructor-teacher/instructor-teacher.component';
import { SubjectTeacherService } from 'src/app/shared/services/subject-teacher/subject-teacher.service';
import { HttpClientModule } from '@angular/common/http';
import { ClassModule } from 'src/app/shared/modules/class/class.module';
import { InstructorStudentComponent } from './components/instructor-student/instructor-student.component';
import { FormsModule } from '@angular/forms';
import { UserModule } from 'src/app/shared/modules/user/user.module';
import { ChatResourceModule } from 'src/app/shared/modules/chat-resource/chat-resource.module';
import { CallLayoutComponent } from 'src/app/shared/components/call-layout/call-layout.component';
import { CallModule } from 'src/app/shared/modules/call/call.module';
import { RecentModule } from 'src/app/shared/modules/recent/recent.module';




@NgModule({
  declarations: [InstructorTeacherComponent, InstructorStudentComponent],
  imports: [
    CommonModule,
    InstructorRoutingModule,
    MaterialModule,
    HttpClientModule,
    ClassModule,
    FormsModule,
    UserModule,
    ChatResourceModule,
    CallModule,
    RecentModule,

  ],
  providers: [
    SubjectTeacherService
  ],
})
export class InstructorModule { }
