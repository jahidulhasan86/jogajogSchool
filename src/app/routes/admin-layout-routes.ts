import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/auth.guard';
import { CanLoadAdminModule } from '../modules/admin/admin-module.guard';

export const ADMIN_ROUTES: Routes = [    
    {
        path: 'admin',
        loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule),
        canActivate:[AuthGuard],
        canLoad:[CanLoadAdminModule]
    }
]