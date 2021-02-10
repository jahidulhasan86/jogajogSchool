import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {SigninComponent} from './signin/signin.component';
import {AdminService} from '../../shared/services/admin_services/admin.service'
import {CompanyService} from '../../shared/services/company_service/company.service'
import {SkoolService} from '../../shared/services/skool_service/skool.service'
import {StudentService} from '../../shared/services/student_service/student.service'
import {TeacherService} from '../../shared/services/teacher_service/teacher.service'
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
 import {RolePopupDialogComponent} from './signin/role-popup-dialog/role-popup-dialog.component'
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AccountService } from 'src/app/shared/services/user_service/account.service';
import { XmppChatService } from 'src/app/shared/services/xmpp-chat/xmpp-chat.service';
import { CanLoadAdminModule } from '../admin/admin-module.guard';
import { CanLoadInstructorModule } from '../instructor/instructor-module.guard';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [SignupComponent, LoginComponent,SigninComponent,RolePopupDialogComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,               
    HttpClientModule
    
  ],
  entryComponents:[RolePopupDialogComponent],
  providers:[AdminService,StudentService,TeacherService,SkoolService,
    CompanyService,AccountService, XmppChatService
    
  
  ]
})
export class AuthModule { } 
