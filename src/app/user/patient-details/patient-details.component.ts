import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {PatientsService} from '../../services/patients.service';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {AuthService} from '../../services/auth.service';
import {InvestigationsService} from '../../services/investigations.service';
import {PrescriptionsService} from '../../services/prescriptions.service';
import {Investigation} from '../../models/investigation';
import {Prescription} from '../../models/prescription';
import {TestsService} from '../../services/tests.service';
import {MedicinesService} from '../../services/medicines.service';
import {Staff} from '../../models/staff';
import {Test} from '../../models/test';
import {Medicine} from '../../models/medicine';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-patient-details',
    templateUrl: './patient-details.component.html',
    styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
    patient;

    age;

    houseNumber;
    kebele;
    subCity;
    city;

    datesOfAdmission = [];

    showAdmissions = false;
    showDiagnoses = false;
    showInvestigations = false;

    allInvestigations = [];

    availableTests;
    private availableTestSub: Subscription;

    selectedInvestigation;
    investigation;

    investigations;
    private investigationsSub: Subscription;
    currentPatientInvestigations = [];
    orderedInvestigations = [];
    displayedInvestigationsColumns: string[] = ['testName', 'action'];

    medications;
    private medicationSub: Subscription;

    selectedMedication;
    prescription;

    prescriptions;
    private prescriptionsSub: Subscription;
    currentPatientPrescriptions = [];
    addedPrescriptions = [];
    displayedPrescriptionsColumns: string[] = ['medicineName', 'action'];

    diagnosisCtrl = new FormControl();

    diagnosisAdded = false;
    diagnosis;

    constructor(
        private patientsService: PatientsService,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private investigationsService: InvestigationsService,
        private prescriptionsService: PrescriptionsService,
        private testsService: TestsService,
        private medicinesService: MedicinesService
    ) {
    }

    ngOnInit() {
        this.patient = this.patientsService.searchedPatient;

        this.getAllInvestigations();

        this.age = new Date(Date.now()).getFullYear() - parseInt(this.patient.dateOfBirth.split('/')[2], 0);

        const address = this.patient.address.split(',');
        this.city = address[0];
        this.subCity = address[1];
        this.kebele = address[2];
        this.houseNumber = address[3];

        if (isNotNullOrUndefined(this.patient.datesOfAdmission)) {
            this.patient.datesOfAdmission.forEach((d) => {
                this.datesOfAdmission.push(new Date(parseInt(d, 0)).getDate() + '/' +
                    new Date(parseInt(d, 0)).getMonth() + '/' +
                    new Date(parseInt(d, 0)).getFullYear());
            });
        }

        this.investigations = this.investigationsService.investigations;
        this.investigationsSub = this.investigationsService.getInvestigationUpdatedListener()
            .subscribe((investigations: Investigation[]) => {
                this.investigations = investigations;
                this.getAllInvestigations();
            });

        this.prescriptions = this.prescriptionsService.prescriptions;
        this.prescriptionsSub = this.prescriptionsService.getPrescriptionUpdatedListener()
            .subscribe((prescriptions: Prescription[]) => {
                this.prescriptions = prescriptions;
            });

        this.availableTests = this.testsService.tests;
        this.availableTestSub = this.testsService.getTestUpdatedListener()
            .subscribe((tests: Test[]) => {
                this.availableTests = tests;
            });
        this.medications = this.medicinesService.medicines;
        this.medicationSub = this.medicinesService.getMedicineUpdatedListener()
            .subscribe((medications: Medicine[]) => {
                this.medications = medications;
            });
    }

    getAllInvestigations() {
        this.allInvestigations = [];
        this.investigationsService.investigations.forEach((investigation) => {
            if (investigation.patientId === this.patient.id) {
                this.testsService.getTest(investigation.testId);
                let res;
                if (investigation.done) {
                    res = investigation.results;
                } else {
                    res = 'Pending';
                }
                const inv = {
                    type: this.testsService.searchedTest.testName,
                    results: res
                };
                this.allInvestigations.push(inv);
            }
        });
        console.log(this.allInvestigations);
    }

    orderInvestigation() {
        this.investigation = {
            id: null,
            testId: this.selectedInvestigation.id,
            doctorId: this.authService.loggedInStaff.id,
            patientId: this.patient.id,
            done: false,
            results: ' '
        };
        this.investigations.forEach((investigation) => {
            if (investigation.patientId === this.patient.id) {
                this.currentPatientInvestigations.push(investigation);
            }
        });
        let add = true;
        // this.currentPatientInvestigations.forEach((investigation) => {
        //     if (investigation.id === this.selectedInvestigation.id) {
        //         this.snackBar.open('Investigation already ordered.', 'Dismiss', {duration: 2000});
        //         add = false;
        //     }
        // });

        if (add) {
            this.orderedInvestigations.push(this.investigation);
            this.orderedInvestigations = [...this.orderedInvestigations];
            this.investigationsService.addInvestigation(this.investigation);
            this.investigations = [...this.investigations];
        }
    }

    removeInvestigation(investigation) {
        this.orderedInvestigations.splice(this.orderedInvestigations.indexOf(investigation), 1);
        this.orderedInvestigations = [...this.orderedInvestigations];
        this.investigationsService.deleteInvestigation(investigation.id);
        this.investigations = [...this.investigations];
    }

    prescribeMedication() {
        this.prescription = {
            id: null,
            medicineId: this.selectedMedication.id,
            doctorId: this.authService.loggedInStaff.id,
            patientId: this.patient.id,
            dispensed: false
        };

        this.prescriptions.forEach((prescription) => {
            if (prescription.patientId === this.patient.id) {
                this.currentPatientPrescriptions.push(prescription);
            }
        });
        let add = true;
        // this.currentPatientPrescriptions.forEach((prescription) => {
        //     if (prescription.id === this.selectedMedication.id) {
        //         this.snackBar.open('Medication already prescribed.', 'Dismiss', {duration: 2000});
        //         add = false;
        //     }
        // });

        if (add) {
            this.addedPrescriptions.push(this.prescription);
            this.addedPrescriptions = [...this.addedPrescriptions];
            this.prescriptionsService.addPrescription(this.prescription);
            this.prescriptions = [...this.prescriptions];
        }
        // let add = true;
        // this.prescriptions.forEach((prescription) => {
        //     if (prescription.id === this.selectedMedication.id) {
        //         this.snackBar.open('Medication already prescribed.', 'Dismiss', {duration: 2000});
        //         add = false;
        //     }
        // });
        //
        // if (add) {
        //     this.prescriptions.push({id: this.selectedMedication.id, name: this.selectedMedication.name});
        //     this.prescriptions = [...this.prescriptions];
        // }
    }

    removePrescription(medication) {
        this.addedPrescriptions.splice(this.addedPrescriptions.indexOf(medication), 1);
        this.addedPrescriptions = [...this.addedPrescriptions];

        this.prescriptionsService.deletePrescription(medication.id);
        this.prescriptions = [...this.prescriptions];
    }

    addDiagnosis() {
        if (isNotNullOrUndefined(this.diagnosisCtrl.value)) {
            let d;
            d = this.patient.diagnoses;
            d.push(this.diagnosisCtrl.value);
            this.patientsService.addDiagnosis(this.patient.id, d);
            this.diagnosis = this.diagnosisCtrl.value;
            this.diagnosisAdded = true;
            this.snackBar.open('Diagnosis added.', 'Dismiss', {duration: 2000});
            this.diagnosisCtrl.setValue(null);
        } else {
            this.snackBar.open('You must enter a diagnosis first.', 'Dismiss', {duration: 3000});
        }
    }

}
