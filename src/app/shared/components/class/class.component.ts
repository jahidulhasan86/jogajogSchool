import { Component, OnInit, ViewChild, EventEmitter, Output, AfterViewChecked, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination';
import { SubjectTeacherService } from '../../services/subject-teacher/subject-teacher.service';
import { TeacherExamsComponent } from '../teacher-exams/teacher-exams.component';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from '../../services/user_service/account.service';
import { MatDialog } from '@angular/material/dialog';
import { WaitForHostComponent } from 'src/app/modules/student/wait-for-host/wait-for-host.component';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 3,
    currentPage: 1
  };
  subjects = [];

  examsTeacher = false;

  examsStudent = false;

  chat = false;

  selected_subject;

  sUser: any;

  @ViewChild('texam') private tExamcomp: TeacherExamsComponent;

  exam_list_view: boolean = false;

  sendSubject: {};

  sessionUser: any;

  studentRole: any;

  selectedSubject: any;

  teacherRole = false;

  subId: NodeJS.Timeout;

  constructor(private subjectTeacherService: SubjectTeacherService,
    private router: Router,
    private xmppChatService: XmppChatService, private spinner: NgxSpinnerService, private accountService: AccountService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
    this.sessionUser = JSON.parse(localStorage.getItem('sessionUser'))
    this.studentRole = this.sessionUser.student_info;
    if (this.sUser.role.role_name === "Teacher") {
      this.teacherRole = true;
    }
    this.spinner.show();
    this.getClassWiseSubjectAndTeacher();
  }

  getClassWiseSubjectAndTeacher() {
    const sessionUser = JSON.parse(localStorage.getItem('sessionUser'))
    const query = sessionUser.teacher_info ? `teacher_id=${sessionUser.teacher_info.user_id}` : `class_id=${sessionUser.student_info.class_id}`;
    this.subjectTeacherService.getClassWiseSubjectsAndTeachersByClassId(query, true).subscribe((result) => {
      if (result.status == 'ok') {
        console.log('getClassWiseSubjectAndTeacher', result)
        this.getConferencesStatusbyIds(result)
      }
    }, (error) => {
      console.log(error)
    })
  }

  getConferencesStatusbyIds(subjects) {
    this.subjectTeacherService.getConferencesStatusbyIds(subjects.subjectIds).subscribe((result: any) => {
      if (result.status == 'ok') {
        this.spinner.hide();
        console.log('getConferencesStatusbyIds', result)
        Object.assign(subjects, { confStatus: result })
        this.mergeConferenceStatusWithSubject(subjects)
      }
    }, (error) => {
      console.log(error)
    })
  }

  mergeConferenceStatusWithSubject(subjects) {
    const subjectWithStatus = this.subjectTeacherService.mergeConferenceStatusWithSubject(subjects)
    if (!!subjectWithStatus) {
      this.flatSubjectListByClass(subjectWithStatus)
    }
  }

  flatSubjectListByClass(subjects) {
    this.subjects = this.subjectTeacherService.flatSubjectListByClass(subjects)
    if (localStorage.getItem('current_page')) {
      this.config.currentPage = parseInt(localStorage.getItem('current_page'))
      // localStorage.removeItem('current_page')
      // localStorage.removeItem('selected_subject_id')
      let sub_id = localStorage.getItem("selected_subject_id");
      const subject_id = document.getElementById(sub_id)
      const examHistId = document.getElementById('examHist')
      /*   if (!!subject_id) {
          subject_id.click();
          examHistId.click();
          localStorage.removeItem('selected_subject_id')
          //clearTimeout(this.subId)
        } */
      console.log(localStorage.getItem('current_page'));
      this.retainState();
    }
  }

  retainState() {
    this.spinner.show();
    /* if(localStorage.getItem('current_page')){
      this.config.currentPage = parseInt(localStorage.getItem('current_page'));
      let sub_id = localStorage.getItem("selected_subject_id");
      if(!sub_id) return;
      const subject_id = document.getElementById(sub_id)
      
      if(!subject_id) return;     
      localStorage.removeItem('current_page');
      subject_id.click();
      localStorage.removeItem('selected_subject_id');
    } */

    this.subId = setInterval(() => {
      if (localStorage.getItem('current_page')) {
        this.config.currentPage = parseInt(localStorage.getItem('current_page'));
        let sub_id = localStorage.getItem("selected_subject_id");
        const subject_id = document.getElementById(sub_id);
        localStorage.removeItem('current_page');
        localStorage.removeItem('selected_subject_id');
        if (!!subject_id) {
          subject_id.click();
          this.spinner.hide();
          clearTimeout(this.subId)
        } else {
          this.spinner.hide();
        }
      }
    }, 1000)
  }

  loadExamBySubject(subject) {
    this.selected_subject = subject.id
  }

  // startClass(id) {
  //    id = id.substring(id.indexOf('_')+1);
  //    this.router.navigate([`instructor/call/${id}`])
  // }

  startClass(subject) {
    const sideNavToggle = document.getElementById("side-nav-toggle")
    if (sideNavToggle) {
      sideNavToggle.click()
    }
    if (this.getUserRole() === "Teacher") {
      this.router.navigate(["instructor/call"], { queryParams: { subject: JSON.stringify(subject) } })
    }else {
      if(subject.conference_status === 'stop' && subject.waiting_for_host === true){
        this.waitForHostHandler(subject)
        return
      }
      this.router.navigate(["student/call"], { queryParams: { subject: JSON.stringify(subject) } })
    }
  }

  loadChatResource(id) {
    // this.router.navigate([`instructor/chat-resource/${id}`])
  }

  // doChat(subject){
  //   localStorage.setItem("selected_subject", JSON.stringify(subject));
  //   this.router.navigate([`instructor/chat-resource/${subject.id}`])
  // }

  doChat(subject) {
    if (this.getUserRole() === "Teacher")
      this.router.navigate(["instructor/chat-resource"], { queryParams: { subject: JSON.stringify(subject), subject_list: JSON.stringify(this.subjects) } })
    else
      this.router.navigate(["student/chat-resource"], { queryParams: { subject: JSON.stringify(subject), subject_list: JSON.stringify(this.subjects) } })
  }

  getUserRole() {
    return this.accountService.getUserRole()
  }

  showExams(subject) {
    if (this.sUser.role.role_name === "Teacher") {
      this.examsTeacher = true;
      this.examsStudent = false;
      this.chat = false;
      this.selected_subject = subject;
      if (this.tExamcomp) {
        this.tExamcomp.subject = subject;
        this.tExamcomp.ngOnInit();
      }
    }
  }

  goExamList(subject) {
    localStorage.removeItem("selected_subject_id");
    localStorage.removeItem("current_page");
    localStorage.setItem("selected_subject_id", subject.id);
    localStorage.setItem("current_page", this.config.currentPage.toString())
    this.exam_list_view = true
    console.log('subject', subject)
    this.sendSubject = subject
    this.selectedSubject = subject.id
    if (this.tExamcomp) {
      this.tExamcomp.subject = subject;
      this.tExamcomp.ngOnInit();
    }
  }

  waitForHostHandler(subject) {
    const dialogRef = this.dialog.open(WaitForHostComponent, {
      width: '65%',
      height: '50%',
      data: subject,
      disableClose: true,
      panelClass: 'wait_for_host'
    });
    localStorage.setItem('isWaitForHostDialogOpen', 'yes')
  }
}
