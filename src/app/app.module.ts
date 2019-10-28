import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { HomeComponent } from './home/home.component';
import { ManageAccountComponent } from './user/manage-account/manage-account.component';
import { LoginComponent } from './user/login/login.component';
import { HeaderComponent } from './header/header.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { StaffHomeComponent } from './user/staff-home/staff-home.component';
import { ManageAdministratorsComponent } from './admin/manage-administrators/manage-administrators.component';
import { ManageStaffComponent } from './admin/manage-staff/manage-staff.component';
import { RegisterPatientComponent } from './user/register-patient/register-patient.component';
import { SearchPatientComponent } from './user/search-patient/search-patient.component';
import { PrescriptionsComponent } from './user/prescriptions/prescriptions.component';
import { InvestigationsComponent } from './user/investigations/investigations.component';
import { MessagesComponent } from './user/messages/messages.component';
import { SystemLogComponent } from './admin/system-log/system-log.component';
import { ManageResourcesComponent } from './admin/manage-resources/manage-resources.component';
import { PatientDetailsComponent } from './user/patient-details/patient-details.component';
import {HttpClientModule} from '@angular/common/http';
import { ChatComponent } from './user/chat/chat.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ManageAccountComponent,
        LoginComponent,
        HeaderComponent,
        AdminHomeComponent,
        StaffHomeComponent,
        ManageAdministratorsComponent,
        ManageStaffComponent,
        RegisterPatientComponent,
        SearchPatientComponent,
        PrescriptionsComponent,
        InvestigationsComponent,
        MessagesComponent,
        SystemLogComponent,
        ManageResourcesComponent,
        PatientDetailsComponent,
        ChatComponent
    ],
    entryComponents: [ChatComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
