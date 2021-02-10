import { Component, OnInit } from '@angular/core';
import { SubjectTeacherService } from 'src/app/shared/services/subject-teacher/subject-teacher.service';

@Component({
  selector: 'app-instructor-student',
  templateUrl: './instructor-student.component.html',
  styleUrls: ['./instructor-student.component.css']
})
export class InstructorStudentComponent implements OnInit {

  selected_user_id: any;

  students = []

  userFilter: any = { user_name: '' };

  constructor(private subjectTeacherService: SubjectTeacherService) { }

  ngOnInit(): void {
    this.getClassStudentsByTeacherId()
  }

  getClassStudentsByTeacherId() {
    this.subjectTeacherService.getClassStudentsByTeacherId().subscribe((result: any) => {
      if (result.status == 'ok') {
        console.log('getClassStudentsByTeacherId', result)
        this.flatStudentListByClass(result.result)
      }
    }, (error) => {
      console.log(error)
    })
  }

  selectedStudent(student) {
    this.selected_user_id = student.user_id
  }

  flatStudentListByClass(classes) {
    this.students = this.subjectTeacherService.flatStudentListByClass(classes)
    if (this.students.length > 0) {
      this.selectedStudent(this.students[0])
    }
  }

}
