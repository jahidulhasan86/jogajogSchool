import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddExamComponent } from './components/add-exam/add-exam.component';
import { AdminClassComponent } from './components/admin-class/admin-class.component';
import { ClassWiseSubjectTeacherComponent } from './components/class-wise-subject-teacher/class-wise-subject-teacher.component';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { StudentsComponent } from './components/students/students.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'class', component: AdminClassComponent },
  { path: 'teachers', component: TeachersComponent },
  { path: 'subjects', component: ClassWiseSubjectTeacherComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'exam_activity', component: AddExamComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
