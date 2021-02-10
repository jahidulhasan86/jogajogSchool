import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ADMIN_ROUTES} from './routes/admin-layout-routes';
import {INSTRUCTOR_ROUTES} from './routes/instructor-layout-routes';
import {AUTH_ROUTES} from './routes/auth-layout-rotes';
import {AdminLayoutComponent} from './layouts/admin/admin-layout/admin-layout.component'
import { StudentLayoutComponent } from './layouts/student/student-layout/student-layout.component';
import { STUDENT_ROUTES } from './routes/student-layout-routes';
import { InstructorLayoutComponent } from './layouts/instructor/instructor-layout/instructor-layout.component';
import { RECORDING_PLAY_ROUTES } from './routes/recording-play-layout-routes';

const routes: Routes = [
  { path: '', children: AUTH_ROUTES },
  { path: '', component: AdminLayoutComponent, children: ADMIN_ROUTES },  
  { path: '', component: InstructorLayoutComponent, children: INSTRUCTOR_ROUTES },
  { path: '', component: StudentLayoutComponent, children: STUDENT_ROUTES },
  { path: '', children: RECORDING_PLAY_ROUTES }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
