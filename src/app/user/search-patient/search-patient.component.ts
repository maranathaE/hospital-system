import {Component, OnDestroy, OnInit} from '@angular/core';
import {Patient} from '../../models/patient';
import {FormControl} from '@angular/forms';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {PatientDetailsComponent} from '../patient-details/patient-details.component';
import {PatientsService} from '../../services/patients.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-search-patient',
    templateUrl: './search-patient.component.html',
    styleUrls: ['./search-patient.component.scss']
})
export class SearchPatientComponent implements OnInit, OnDestroy {
    nameSearchCtrl = new FormControl();
    phoneNumberSearchCtrl = new FormControl();

    patients;
    private patientsSub: Subscription;
    searchedPatients = [];
    patient;

    displayedColumns: string[] = ['name', 'phoneNumber', 'dateOfLastAdmission'];
    dataSource: any = new MatTableDataSource(this.searchedPatients);

    constructor(private patientsService: PatientsService, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.patients = this.patientsService.patients;
        this.patientsSub = this.patientsService.getPatientUpdatedListener()
            .subscribe((patients: Patient[]) => {
                this.patients = patients;
            });
    }

    ngOnDestroy() {
        this.patientsSub.unsubscribe();
    }

    searchPatients(searchBy: string) {
        this.searchedPatients = [];

        if (searchBy === 'name') {
            if (isNotNullOrUndefined(this.nameSearchCtrl.value) && this.nameSearchCtrl.value.length !== 0) {
                this.phoneNumberSearchCtrl.disable();
                this.patients.forEach((patient) => {
                    if (patient.name.toLowerCase().startsWith(this.nameSearchCtrl.value.toLowerCase())) {
                        this.searchedPatients.push(patient);
                    }
                });
            } else if (this.nameSearchCtrl.value.length === 0) {
                this.phoneNumberSearchCtrl.enable();
            }
        } else {
            if (isNotNullOrUndefined(this.phoneNumberSearchCtrl.value) && this.phoneNumberSearchCtrl.value.length !== 0) {
                this.nameSearchCtrl.disable();
                this.patients.forEach((patient) => {
                    if (patient.phoneNumber.toLowerCase().startsWith(this.phoneNumberSearchCtrl.value.toLowerCase())) {
                        this.searchedPatients.push(patient);
                    }
                });
            } else if (this.phoneNumberSearchCtrl.value.length === 0) {
                this.nameSearchCtrl.enable();
            }
        }
        this.dataSource = this.searchedPatients;
        this.dataSource = [...this.dataSource];
    }


    openPatient(value) {
      this.openDialog();
      this.patient = this.patientsService.getPatient(value);
    }

    openDialog() {
      this.dialog.open(PatientDetailsComponent, {height: '80%', width: '70%'});
    }

}
