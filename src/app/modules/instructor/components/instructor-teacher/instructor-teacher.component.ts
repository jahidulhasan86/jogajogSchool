import { Component, OnInit } from '@angular/core';
import { SubjectTeacherService } from 'src/app/shared/services/subject-teacher/subject-teacher.service';

@Component({
  selector: 'app-instructor-teacher',
  templateUrl: './instructor-teacher.component.html',
  styleUrls: ['./instructor-teacher.component.css']
})
export class InstructorTeacherComponent implements OnInit {

  teachers = [];

  selected_user_id: any;

  userFilter: any = { user_name: '' };

  constructor(private subjectTeacherService: SubjectTeacherService) { }

  ngOnInit(): void {
    this.GetTeacherByBranchIdSchoolId()
  }

  GetTeacherByBranchIdSchoolId(){
    this.subjectTeacherService.GetTeacherByBranchIdSchoolId('cde41a70-0c74-11eb-9dbf-9663dca59a38', 'd17b5d3f-565a-4d5b-8815-e556b7cf90ed').subscribe((result) => {
      if(result.status == 'ok'){
        console.log('GetTeacherByBranchIdSchoolId', result)
        this.teachers = result.resultset
        if(this.teachers.length > 0){
          this.selectedTeacher(this.teachers[0])
        }
      }
    }, (error) => {
      console.log(error)
    })
  }

  selectedTeacher(teacher){
    this.selected_user_id = teacher.user_id
  }

}
