import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallLayoutComponent } from 'src/app/shared/components/call-layout/call-layout.component';
import { ClassLayoutComponent } from 'src/app/shared/components/class-layout/class-layout.component';
import { ClassComponent } from 'src/app/shared/components/class/class.component';
import { LiveExamComponent } from 'src/app/shared/components/student/live-exam/live-exam.component';
import { ViewExamComponent } from 'src/app/shared/components/student/view-exam/view-exam.component';
import { UserLayoutComponent } from 'src/app/shared/components/user-layout/user-layout.component';
import { RecentLayoutComponent } from 'src/app/shared/components/recent-layout/recent-layout.component';

const routes: Routes = [
  { path: '', component: ClassComponent },
  { path: 'chat-resource', component: ClassLayoutComponent },
  { path: 'teachers', component: UserLayoutComponent },
  { path: 'class-mate', component: UserLayoutComponent },
  { path: 'live-exam', component: LiveExamComponent },
  { path: 'view-exam', component: ViewExamComponent },
  { path: 'call', component: CallLayoutComponent },
  { path: 'recent', component: RecentLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
