import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../../components/profile/profile.component';
import { AccountService } from '../../services/user_service/account.service';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';



@NgModule({
  declarations: [ProfileComponent, UserProfileComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
  ],
  exports:[
    ProfileComponent,
    UserProfileComponent
  ],
  providers:[
    AccountService
  ]
})
export class SharedLayoutModule { }
