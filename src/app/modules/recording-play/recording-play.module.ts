import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordingPlayRoutingModule } from './recording-play-routing.module';
import { RecordingPlayComponent } from 'src/app/layouts/recording-play/recording-play/recording-play.component';
import { RecordingPlayService } from 'src/app/shared/services/recording-play/recording-play.service';


@NgModule({
  declarations: [RecordingPlayComponent],
  imports: [
    CommonModule,
    RecordingPlayRoutingModule
  ],
  providers: [
    RecordingPlayService
  ],
})
export class RecordingPlayModule { }
