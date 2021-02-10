import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubjectTeacherService } from 'src/app/shared/services/subject-teacher/subject-teacher.service';

@Component({
  selector: 'app-wait-for-host',
  templateUrl: './wait-for-host.component.html',
  styleUrls: ['./wait-for-host.component.css']
})
export class WaitForHostComponent implements OnInit {

  conferenceInfo: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WaitForHostComponent>, public dialog: MatDialog, private subjectTeacherService: SubjectTeacherService) {
    this.conferenceInfo = this.data
  }

  ngOnInit(): void {
    if (!!this.conferenceInfo) {
      this.addNewObjForConfInfo()
      this.notify()
    }
  }

  closeDialog() {
    localStorage.removeItem('isWaitForHostDialogOpen')
    this.dialogRef.close()
  }

  notify() {
    this.subjectTeacherService.notify(this.conferenceInfo).subscribe((result) => {
      if (result.status == 'ok') {
        console.log(result)
      }
    }, err => {
      console.log(err)
    })
  }

  addNewObjForConfInfo() {
    let teachers_name = []
    let userObj = {}
    let teacherList = []
    this.conferenceInfo.teachers.forEach(teacher => {
      userObj = {}
      if (!!teacher) {
        teachers_name.push(teacher.teacher_name)
        Object.assign(userObj, {id: teacher.teacher_id, email: '', notify_methods: ['push', 'email']})
        teacherList.push(userObj)
      }
    });
    Object.assign(this.conferenceInfo, { teachers_name: teachers_name.toString(), teacherList: teacherList })
  }

}
