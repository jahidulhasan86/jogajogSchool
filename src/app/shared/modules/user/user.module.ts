import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { UserLayoutComponent } from '../../components/user-layout/user-layout.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student_service/student.service';
import { TeacherService } from '../../services/teacher_service/teacher.service';
import { ChatResourceModule } from '../chat-resource/chat-resource.module';



@NgModule({
  declarations: [UserLayoutComponent, UserListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ChatResourceModule
  ],
  exports: [
    UserLayoutComponent,
    UserListComponent
  ],
  providers:[StudentService,TeacherService]
})
export class UserModule { }
