import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminSideNavComponent } from './layouts/admin/admin-side-nav/admin-side-nav.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { HeaderComponent } from './layouts/shared/header/header.component';
import { FooterComponent } from './layouts/shared/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/modules/material/material.module';
import { InstructorLayoutComponent } from './layouts/instructor/instructor-layout/instructor-layout.component';
import { StudentLayoutComponent } from './layouts/student/student-layout/student-layout.component';
import { InstructorSideNavComponent } from './layouts/instructor/instructor-side-nav/instructor-side-nav.component';
import { StudentSideNavComponent } from './layouts/student/student-side-nav/student-side-nav.component';
import { AdminHeaderComponent } from './layouts/admin/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { XmppChatService } from './shared/services/xmpp-chat/xmpp-chat.service';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './shared/components/log-out/log-out-.component'
import { SharedLayoutModule } from './shared/modules/shared-layout/shared-layout.module';
import { CanLoadInstructorModule } from './modules/instructor/instructor-module.guard';
import { CanLoadAdminModule } from './modules/admin/admin-module.guard';
import { AuthGuard } from './modules/auth/auth.guard';
import { CanLoadStudentModule } from './modules/student/student-module.guard';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AdminSideNavComponent,
    InstructorLayoutComponent,
    InstructorSideNavComponent,
    StudentLayoutComponent,
    StudentSideNavComponent,
    HeaderComponent,
    FooterComponent,
    AdminHeaderComponent,
    LogoutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule,   
    HttpClientModule,
    SharedLayoutModule
  ],
  providers: [XmppChatService,CanLoadInstructorModule,CanLoadAdminModule,AuthGuard,CanLoadStudentModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
