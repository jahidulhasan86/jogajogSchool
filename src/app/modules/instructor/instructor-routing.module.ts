import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatResourceLayoutStandaloneComponent } from 'src/app/shared/components/chat-resource-layout-standalone/chat-resource-layout-standalone.component';
import { ClassComponent } from 'src/app/shared/components/class/class.component';
import { UserLayoutComponent } from 'src/app/shared/components/user-layout/user-layout.component';
import { InstructorStudentComponent } from './components/instructor-student/instructor-student.component';
import { InstructorTeacherComponent } from './components/instructor-teacher/instructor-teacher.component';
import { CallLayoutComponent } from 'src/app/shared/components/call-layout/call-layout.component';
import { TeacherViewExamComponent } from 'src/app/shared/components/teacher-view-exam/teacher-view-exam.component';
import { ClassLayoutComponent } from 'src/app/shared/components/class-layout/class-layout.component';
import { RecentLayoutComponent } from 'src/app/shared/components/recent-layout/recent-layout.component';

const routes: Routes = [
  { path: '', component: ClassComponent },
  { path: 'chat-resource', component: ClassLayoutComponent },
  { path: 'teacher', component: UserLayoutComponent },
  { path: 'student', component: UserLayoutComponent },
  { path: 'call', component: CallLayoutComponent },
  { path: 'teacher-view-exam', component: TeacherViewExamComponent },
  { path: 'recent', component: RecentLayoutComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
