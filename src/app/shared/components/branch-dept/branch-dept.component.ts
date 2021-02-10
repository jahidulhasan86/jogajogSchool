import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdminService } from '../../services/admin_services/admin.service';

@Component({
  selector: 'app-branch-dept',
  templateUrl: './branch-dept.component.html',
  styleUrls: ['./branch-dept.component.css']
})
export class BranchDeptComponent implements OnInit, OnChanges {
  public branch_dept = {
    branch: '',
    dept: '',
  }
  branchList: any;
  selectedBranch: any;
  departmentList: any;
  selectedDepartment: any;
  @Input() optionReset: any
  @Output() sendDept = new EventEmitter<any>()
  @Input() component_name: any
  @Input() childMessage: any;

  constructor(public adminService: AdminService) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
    if (changes.optionReset.currentValue != 0) {
      let obj = JSON.parse(localStorage.getItem("schoolInfo"));
      if (obj) {
        this.getAllBranchBySchoolId(obj.id);
      }
    }
  }

  ngOnInit(): void {
    let obj = JSON.parse(localStorage.getItem("schoolInfo"));
    this.getAllBranchBySchoolId(obj.id);
  }

  getAllBranchBySchoolId(schoolId) {
    this.adminService.getAllBranchBySchoolId(schoolId).subscribe(
      (result) => {
        if (result.status == "ok") {
          this.branchList = result.resultset;
          console.log('branchList', this.branchList)
          this.selectedBranch = this.branchList[0]
          this.getAllDeptByBranchId()
        }
      },
      (err) => {
        this.branchList = [];
      }
    );
  }

  getAllDeptByBranchId() {
    this.adminService.getAllDeptByBranchId(this.selectedBranch.id).subscribe(
      (result) => {
        if (result.status == "ok") {
          this.departmentList = result.resultset;
          console.log('deptList', this.departmentList)
          if (!this.childMessage || this.childMessage === undefined) this.selectedDepartment = this.departmentList[0]
          if (!!this.childMessage) {
            this.departmentList.forEach(dept => {
              if (dept.id === this.childMessage.dept_id) {
                this.selectedDepartment = dept
              }
            });
          }
          this.changeDepatment(this.selectedDepartment)
          this.sendSelectedDept(this.selectedDepartment, this.selectedBranch)
        }
      },
      (err) => {
        this.departmentList = [];
      }
    );
  }

  changeDepatment(event) {
    // console.log('ch', event)
    this.selectedDepartment = event
    this.sendSelectedDept(this.selectedDepartment, this.selectedBranch)
  }

  sendSelectedDept(deptInfo, branchInfo) {
    this.branch_dept = {
      dept: deptInfo,
      branch: branchInfo
    }
    this.sendDept.emit(this.branch_dept)
  }

}
