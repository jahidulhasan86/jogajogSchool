import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordingPlayComponent } from 'src/app/layouts/recording-play/recording-play/recording-play.component';


const routes: Routes = [
  { path: '', component: RecordingPlayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordingPlayRoutingModule { }
