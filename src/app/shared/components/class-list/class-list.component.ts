import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISubject } from '../../interfaces/ISubject';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css']
})
export class ClassListComponent implements OnInit {

  @Input() subjectObj: ISubject

  @Output() SubjectEvtEmitter = new EventEmitter<any>();

  selected_user_id: any;

  list_name: string

  subjectFilter: any = { subject_name: '' };

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.subjectObj.subjects.length > 0) {
        this.subjectSelectedForChat()
      }
    }, 500);
  }

  selectedSubject(subject) {
    this.selected_user_id = subject.id
    this.SubjectEvtEmitter.emit(subject)
  }

  subjectSelectedForChat(){
    this.subjectObj.subjects.forEach((subject: any) => {
      if(subject.id === this.subjectObj.selected_subject.id){
        this.selectedSubject(subject)
      }
    })
  }

}
