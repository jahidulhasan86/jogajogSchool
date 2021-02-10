import { Routes } from '@angular/router';

export const RECORDING_PLAY_ROUTES: Routes = [    
    {
        path: 'recording-play',
        loadChildren: () => import('../modules/recording-play/recording-play.module').then(m => m.RecordingPlayModule)
    }
]