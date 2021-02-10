import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/auth.guard';
import { CanLoadInstructorModule } from '../modules/instructor/instructor-module.guard';

export const INSTRUCTOR_ROUTES: Routes = [    
    {
        path: 'instructor',
        loadChildren: () => import('../modules/instructor/instructor.module').then(m => m.InstructorModule),
        canActivate:[AuthGuard],
        canLoad:[CanLoadInstructorModule]
    }
]