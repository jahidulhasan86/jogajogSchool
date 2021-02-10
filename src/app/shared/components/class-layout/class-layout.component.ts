import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-class-layout',
  templateUrl: './class-layout.component.html',
  styleUrls: ['./class-layout.component.css']
})
export class ClassLayoutComponent implements OnInit {

  subjectObj = {
    subjects: [],
    selected_subject: '',
    list_name: ''
  }
  
  subject: any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getSubjectList()
  }

  getSubjectList() {
    this.route.queryParamMap.subscribe((x) => {
      if (!!x) {
        this.subjectObj.subjects = JSON.parse(x.get('subject_list'))
        this.subjectObj.selected_subject = JSON.parse(x.get('subject'))
        this.subjectObj.list_name = this.currentUrl(location.pathname)
      }
    })
  }

  currentUrl(url) {
    if (url === '/instructor/chat-resource') {
      return 'Subjects'
    }
  }

  SubjectEvtEmitter(subject){
    this.subject = subject
  }

}
