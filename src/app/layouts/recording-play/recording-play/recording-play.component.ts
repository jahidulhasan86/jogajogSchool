import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordingPlayService } from 'src/app/shared/services/recording-play/recording-play.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-recording-play',
  templateUrl: './recording-play.component.html',
  styleUrls: ['./recording-play.component.css']
})
export class RecordingPlayComponent implements OnInit {

  files: any[];

  name: string;

  keys = '$Ue0ugMTAAARrNokdEEiaz';

  constructor(private router: Router, private route: ActivatedRoute, private recordingPlay: RecordingPlayService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((x) => {
      if(!!x) this.getRecordData(this.decryptRecordObject(x.get('record')))
    })
  }

  getRecordData(record) {
    if (!record) {
      this.router.navigate(['/instructor'])
      return
    }
    this.playBackFileGenerator(record)
  }

  playBackFileGenerator(record) {
    this.name = record.name
    this.recordingPlay.playBackFileGenerator(record).subscribe((result) => {
      if (result.length > 0) {
        this.files = result
      }
    })
  }

  decryptRecordObject(value){
    var deData = CryptoJS.AES.decrypt(decodeURIComponent(value), this.keys); 
    return JSON.parse(deData.toString(CryptoJS.enc.Utf8));
  }
}
