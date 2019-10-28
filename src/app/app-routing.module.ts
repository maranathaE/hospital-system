import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './user/login/login.component';
import {ManageAccountComponent} from './user/manage-account/manage-account.component';
import {ManageAdministratorsComponent} from './admin/manage-administrators/manage-administrators.component';
import {ManageStaffComponent} from './admin/manage-staff/manage-staff.component';
import {RegisterPatientComponent} from './user/register-patient/register-patient.component';
import {SearchPatientComponent} from './user/search-patient/search-patient.component';
import {PrescriptionsComponent} from './user/prescriptions/prescriptions.component';
import {InvestigationsComponent} from './user/investigations/investigations.component';
import {MessagesComponent} from './user/messages/messages.component';
import {SystemLogComponent} from './admin/system-log/system-log.component';
import {ManageResourcesComponent} from './admin/manage-resources/manage-resources.component';
import {PatientDetailsComponent} from './user/patient-details/patient-details.component';
import {AdminHomeComponent} from './admin/admin-home/admin-home.component';


const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'admin-panel', component: AdminHomeComponent},
    {path: '', component: LoginComponent},
    {path: 'manage-account', component: ManageAccountComponent},
    {path: 'manage-administrators', component: ManageAdministratorsComponent},
    {path: 'manage-staff', component: ManageStaffComponent},
    {path: 'register-patient', component: RegisterPatientComponent},
    {path: 'search-patient', component: SearchPatientComponent},
    {path: 'patient-details/:id', component: PatientDetailsComponent},
    {path: 'prescriptions', component: PrescriptionsComponent},
    {path: 'investigations', component: InvestigationsComponent},
    {path: 'messages', component: MessagesComponent},
    {path: 'system-log', component: SystemLogComponent},
    {path: 'manage-resources', component: ManageResourcesComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
