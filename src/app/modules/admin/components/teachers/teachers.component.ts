import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import { AddTeacherComponent } from '../add-teacher/add-teacher.component';

export interface TeacherData {
  position: Number;
  name: string;
  created: string;
  active: boolean;
  class_id: string;
  teacher_id: string;
  id: string;
  class_name: string;
  is_active: true;
  dept_id: string;
  dept_name: string;
  branch_id: string;
  branch_name: string;
}

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  displayedColumns: string[] = ["position","name","branch_name","dept_name","created","active","action"];
  dataSource: MatTableDataSource<TeacherData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  component_name_for_child = 'class'
  selectedBranch: any;
  selectedDepartment: any;
  teachersList: any;
  optionReset = 0

  constructor(private dialog: MatDialog, public adminService: AdminService, private spinner: NgxSpinnerService) { 
    this.dataSource = new MatTableDataSource(this.teachersList);
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    this.dataSource = new MatTableDataSource([]);
  }
  deptReceived(event) {
    this.spinner.show()
    console.log(event)
    this.selectedBranch = event.branch
    this.selectedDepartment = event.dept
    this.filterSearchSubmit()
  }

  addTeacherDialog() {
    let dialogRef = this.dialog.open(AddTeacherComponent, {
      disableClose: true,
      panelClass: window.innerWidth <= 768 ? "overflow-dialog-container" : "incoming-call-dialog-container",
      width: window.innerWidth <= 768 ? "80%" : "50%",
    });
  }

  filterSearchSubmit() {
    if (this.selectedBranch && !this.selectedDepartment) {
      this.getTeachersByBranchIdAndSchoolId();
    }
    if (this.selectedBranch && this.selectedDepartment) {
      this.getTeachersByDeptIdAndSchoolId();
    }
  }

  getTeachersByDeptIdAndSchoolId() {
    // this.spinner.show()
    this.adminService
      .GetTeacherByDeptIdSchoolId(this.selectedDepartment.id, this.selectedBranch.school_id)
      .subscribe(
        (result) => {
          this.spinner.hide()
          console.log('teacher_list',result.resultset);
          this.teachersList = result.resultset;
          if(!!this.teachersList){
            this.dataSource = new MatTableDataSource(this.teachersList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        (error) => {
          this.spinner.hide()
          console.log(error);
        }
      );
  }

  getTeachersByBranchIdAndSchoolId() {
    // this.spinner.show()
    this.adminService.GetTeacherByBranchIdSchoolId(this.selectedBranch.id, this.selectedBranch.school_id)
      .subscribe(
        (result) => {
          this.spinner.hide()
          this.teachersList = result.resultset;
          if(!!this.teachersList){
            this.dataSource = new MatTableDataSource(this.teachersList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
  
        },
        (error) => {
          this.spinner.hide()
          console.log(error);
        }
      );
  }
  resetField() {
    this.optionReset ++
  }

}
