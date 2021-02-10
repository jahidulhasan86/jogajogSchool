import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/auth.guard';
import { CanLoadStudentModule } from '../modules/student/student-module.guard';

export const STUDENT_ROUTES: Routes = [    
    {
        path: 'student',
        loadChildren: () => import('../modules/student/student.module').then(m => m.StudentModule),
        canActivate:[AuthGuard],
        canLoad:[CanLoadStudentModule]
    }
]