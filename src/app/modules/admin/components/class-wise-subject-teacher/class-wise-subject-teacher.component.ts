import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import Swal from 'sweetalert2';
import { AddClassWiseSubjectTeacherComponent } from '../add-class-wise-subject-teacher/add-class-wise-subject-teacher.component';

export interface ClassWiseSubAndTeacher {
  class_id: string;
  id: string;
  action_date: string;
  action_type: string;
  class_name: string;
  created: string;
  created_by: string;
  is_active: Boolean;
  sub_pic: string;
  subject_name: string;
  teacher_id: string;
  teacher_user_name: string;
  updated_by: string;
  teachers: Teacher[];
}

export interface Teacher {
  teacher_name: string;
  teacher_id: string;
}

@Component({
  selector: 'app-class-wise-subject-teacher',
  templateUrl: './class-wise-subject-teacher.component.html',
  styleUrls: ['./class-wise-subject-teacher.component.css']
})
export class ClassWiseSubjectTeacherComponent implements OnInit {

  classWiseSubAndTeacherList: ClassWiseSubAndTeacher[];
  displayedColumns: string[] = ["position", "subject_name", "class_name", "teacher_user_name", "created", "action"];
  dataSource: MatTableDataSource<ClassWiseSubAndTeacher>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selectedDepartment: any;
  selectedBranch: any;
  component_name_for_child = 'class'
  classList: any[];
  selectedClass: any;
  optionReset = 0

  constructor(public adminService: AdminService, public dialog: MatDialog, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  deptReceived(event) {
    console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    this.selectedBranch = event.branch
    if (this.selectedDepartment) {
      this.getAllClassByDeptId();
    } else {
      this.classList = [{ id: '0', name: 'No Classes Found' }];
      this.selectedClass = this.classList[0];
      this.classSelector(this.classList[0])
    }
  }

  classSelector(value) {
    this.dataSource = new MatTableDataSource<any>([]);
    this.selectedClass = value
    console.log('selected class', this.selectedClass)
  }

  openAddNewDialog() {
    let dialogRef = this.dialog.open(AddClassWiseSubjectTeacherComponent, {
      disableClose: true,
      panelClass: window.innerWidth <= 768 ? "overflow-dialog-container" : "incoming-call-dialog-container",
      width: window.innerWidth <= 768 ? "80%" : "60%",
    });
  }

  getAllClassByDeptId() {
    this.spinner.show()
    this.adminService.getClassByDeptId(this.selectedDepartment.id).subscribe(
      (result) => {
        if (result.status == "ok") {
          this.classList = result.resultset
          this.selectedClass = this.classList[0];
          this.classSelector(this.classList[0])
          this.spinner.hide()
          // console.log('classList', result.resultset)
          if (!!this.selectedClass) {
            const subjectFindBtn = document.getElementById('subject-find-btn')
            if (!!subjectFindBtn) subjectFindBtn.click()
          }
        }
      },
      (err) => {
        this.spinner.hide()
        this.classList = [];
        console.log("classList error", err);
      }
    );
  }

  getClassWiseSubjectsAndTeachersByClassId() {
    this.spinner.show()
    if (this.selectedClass.id) {
      let query = 'class_id=' + this.selectedClass.id;
      this.adminService
        .getClassWiseSubjectsAndTeachersByClassId(query)
        .subscribe(
          (result) => {
            this.spinner.hide()
            if (result.status == "ok") {
              this.classWiseSubAndTeacherList = result.result;
              console.log(
                "classWisSubTeacherList:",
                this.classWiseSubAndTeacherList
              );
               if (this.classWiseSubAndTeacherList.length == 0){
                Swal.fire({
                  title: `No Subjects found for this ${this.selectedClass.name}`,
                  icon: "info",
                  timer: 2000,
                });
               }
              this.classWiseSubAndTeacherList.forEach(e => {
                let teacherName = '';
                e.teachers.forEach(
                  i => {
                    teacherName = teacherName == '' ? i.teacher_name : teacherName + ',' + i.teacher_name
                  });
                e.teacher_user_name = teacherName;
              })
           
              this.dataSource = new MatTableDataSource(this.classWiseSubAndTeacherList);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          },
          (error) => {
            this.spinner.hide()
            this.classWiseSubAndTeacherList = [];
            console.log(error);
            Swal.fire({
              title: "Error! Please try again later.",
              icon: "warning",
              timer: 2000,
            });
          }
        );
    }
  }

  resetField(){
    this.optionReset ++
  }

}
