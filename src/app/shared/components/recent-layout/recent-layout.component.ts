import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-recent-layout',
  templateUrl: './recent-layout.component.html',
  styleUrls: ['./recent-layout.component.css']
})
export class RecentLayoutComponent implements OnInit {

  subjectObj = {
    subjects: [],
    selected_subject: '',
    list_name: ''
  }
  people : any;
  subject: any;
  @Output() dataEvtEmitter = new EventEmitter<any>();
 

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getSubjectList()
  }

  getSubjectList() {
    // this.route.queryParamMap.subscribe((x) => {
    //   if (!!x) {
    //     this.subjectObj.subjects = JSON.parse(x.get('subject_list'))
    //     this.subjectObj.selected_subject = JSON.parse(x.get('subject'))
    //     this.subjectObj.list_name = this.currentUrl(location.pathname)
    //   }
    // })
  }

  currentUrl(url) {
    // if (url === '/instructor/chat-resource') {
    //   return 'Subjects'
    // }
  }

  SubjectEvtEmitter(subject){
     this.subject = subject
  }

  peopleEvtEmitter(event){
    if(event.group_id){
      this.people = null;
      this.subject= event;
    }else{
      this.people = event;
      this.subject = null;
    }
    //this.people = event;
 }

}
