import { Component, OnInit } from '@angular/core';
import { Iuser } from '../../interfaces/Iuser';
import { SubjectTeacherService } from '../../services/subject-teacher/subject-teacher.service';
import { TeacherService } from '../../services/teacher_service/teacher.service';
import { StudentService } from '../../services/student_service/student.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {

  people

  usersObj: Iuser

  sUser: any;

  isChatSelected: boolean = true;

  constructor(private subjectTeacherService: SubjectTeacherService, private studentService: StudentService, private teacherService: TeacherService) {
  }

  ngOnInit(): void {
    this.currentUrl(location.pathname);
  }

  currentUrl(url) {
    if (url === '/instructor/teacher') {
      this.GetTeacherByBranchIdSchoolId(url)
    } else if (url === '/instructor/student') {
      this.getClassStudentsByTeacherId(url)
    } else if (url === '/student/class-mate') {
      //this.getClassStudentsByTeacherId(url)
      this.getClassMates(url);
    } else if (url === '/student/teachers') {
      this.getTeachersOfStudent(url);
    }
  }

  GetTeacherByBranchIdSchoolId(url) {
    this.subjectTeacherService.GetTeacherByBranchIdSchoolId('cde41a70-0c74-11eb-9dbf-9663dca59a38', 'd17b5d3f-565a-4d5b-8815-e556b7cf90ed').subscribe((result) => {
      if (result.status == 'ok') {
        console.log('GetTeacherByBranchIdSchoolId', result)
        this.usersObj = { users: result.resultset, currentUrl: url }
      }
    }, (error) => {
      console.log(error)
    })
  }

  getClassStudentsByTeacherId(url) {
    this.subjectTeacherService.getClassStudentsByTeacherId().subscribe((result: any) => {
      if (result.status == 'ok') {
        console.log('getClassStudentsByTeacherId', result)
        this.flatStudentListByClass(result.result, url)
      }
    }, (error) => {
      console.log(error)
    })
  }

  flatStudentListByClass(classes, url) {
    this.usersObj = { users: this.subjectTeacherService.flatStudentListByClass(classes), currentUrl: url }
  }

  getClassMates(url) {
    this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
    if (this.sUser.student_info) {
      const { branch_id, class_id, dept_id } = this.sUser.student_info
      this.studentService.getStudentsById(class_id, 'class_id').subscribe((result) => {
        if (result.pgData) {
          this.usersObj = { users: result.pgData, currentUrl: url }
        }
      }, err => {
        console.log(err)
      });
    }
  }

  getTeachersOfStudent(url) {
    this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
    if (this.sUser.student_info) {
      const { branch_id, class_id, dept_id } = this.sUser.student_info
      let query = 'class_id=' + class_id;
      this.teacherService.getClassWiseSubjectsAndTeachersByClassId(query).subscribe(result => {
        let res = result.result;
        let teachers = [];
        res.forEach(e => {
          e.teachers.forEach(t => {
            teachers.push({ user_name: t.teacher_name, dept_name: "N/A", user_id: t.teacher_id });
          })
        })
        teachers = teachers.filter((v, i, a) => a.findIndex(t => (t.user_name === v.user_name)) === i);
        this.usersObj = { users: teachers, currentUrl: url }
      });
    }
  }

  userEvtEmitter(e) {
    this.people = e;
  }
}
