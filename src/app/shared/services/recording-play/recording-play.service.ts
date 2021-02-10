import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordingPlayService {

  files: any[];

  constructor() { }

  playBackFileGenerator(record) {
    this.files = [];
    let object = {
      "user": "",
      "stream": ""
    }
    let Name = "Test";
    let url = "";

    if (record) {
      url = record.recording_url;
      Name = record.name;
      if (record.details != "") {
        let obj = JSON.parse(record.details);
        if (obj) {
          obj.forEach(user => {
            url = url + user.streamId + ".webm";
            object.user = user.user_id;
            object.stream = url;
            this.files.push(url);
            url = record.recording_url;
          });
        }
      }
      //});
    }
    return of(this.files)
  }
}
