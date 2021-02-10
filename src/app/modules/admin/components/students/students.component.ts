import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import Swal from 'sweetalert2';
import { AddStudentComponent } from '../add-student/add-student.component';

export interface Student {
  user_name: string;

}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Student>;
  displayedColumns: string[] = ['position', 'user_name', 'branch_name', 'dept_name', 'action'];
  public loader = false
  selectedDepartment: any;
  selectedBranch: any;
  component_name_for_child = 'class';
  studentGetObj = {
    id: '',
    type: ''
  }
  classList: any[];
  selectedClass: any;
  studentList: any[];
  optionReset = 0

  constructor(private dialog: MatDialog, public adminService: AdminService, private spinner: NgxSpinnerService) { 

      this.dataSource = new MatTableDataSource<Student>(this.studentList);
  }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Student>([]);
  }

  getClassByDeptId() {
    this.spinner.show()
    this.adminService.getClassByDeptId(this.selectedDepartment.id).subscribe(
      (result) => {
        this.spinner.hide()
        if (result.status == "ok") {
          this.classList = result.resultset
          this.selectedClass = this.classList[0];
          this.classSelector(this.classList[0])
          // console.log('classList', result.resultset)
         const student_find_btn =  document.getElementById('student-find-btn')
         if(!!student_find_btn) student_find_btn.click()
        }
      },
      (err) => {
        this.spinner.hide()
        this.classList = [];
        console.log("error from get teacher,", err);
      }
    );
  }
  
  deptReceived(event) {
    console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    this.selectedBranch = event.branch

    if(this.selectedDepartment){ 
      this.getClassByDeptId()
      this.studentGetObj.id = this.selectedDepartment.id
      this.studentGetObj.type = 'dept_id'
    }
    else {
      this.classList = [{ id: '0', name: 'No Classes Found' }];
      this.selectedClass = this.classList[0];
      this.classSelector(this.classList[0])
    }
  }

  getStudentsById() {
    this.spinner.show()
    this.adminService.getStudentsById(this.studentGetObj.id, this.studentGetObj.type).subscribe(result => {
      if (result.status == 'ok') {
        this.spinner.hide()
          this.studentList = result.result.pgData
          //  console.log('studentList',this.studentList)
           this.dataSource = new MatTableDataSource<Student>(this.studentList);
           this.dataSource.paginator = this.paginator;
           this.dataSource.sort = this.sort;

      }
    }, err => {
      this.spinner.hide()
      this.studentList = []
      console.log(err)
  
    })
  }

  addStudentDialog() {
    let addClassDialog = this.dialog.open(AddStudentComponent, {
      disableClose: true,
      panelClass: window.innerWidth <= 768  ? "overflow-dialog-container" : "incoming-call-dialog-container",
      width:  window.innerWidth <= 768  ? "80%" : "60%"
    });
  }

  classSelector(value) {
    this.dataSource = new MatTableDataSource<Student>([]);
    this.selectedClass = value
    console.log(this.selectedClass)
    if (this.selectedClass) {
      this.studentGetObj.id = this.selectedClass.id
      this.studentGetObj.type = 'class_id'
    }
  }
  
  resetField(){
    this.optionReset ++
  }


}
