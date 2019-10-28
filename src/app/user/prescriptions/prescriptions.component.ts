import {Component, OnInit} from '@angular/core';
import {Prescription} from '../../models/prescription';
import {PrescriptionsService} from '../../services/prescriptions.service';
import {Subscription} from 'rxjs';
import {PatientsService} from '../../services/patients.service';
import {StaffsService} from '../../services/staffs.service';
import {MedicinesService} from '../../services/medicines.service';

@Component({
    selector: 'app-prescriptions',
    templateUrl: './prescriptions.component.html',
    styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
    prescriptions;
    private prescriptionsSub: Subscription;

    displayedPrescriptionsColumns: string[] = ['medicine', 'patient', 'doctor', 'action'];

    constructor(
        private prescriptionsService: PrescriptionsService,
        private patientsService: PatientsService,
        private staffsService: StaffsService,
        private medicinesService: MedicinesService) {
    }

    ngOnInit() {
        this.prescriptions = this.prescriptionsService.prescriptions;

        this.prescriptionsSub = this.prescriptionsService.getPrescriptionUpdatedListener()
            .subscribe((prescriptions: Prescription[]) => {
                this.prescriptions = prescriptions;
            });
    }

    markDispensed(prescriptionId: string) {
        this.prescriptionsService.prescriptionDispensed(prescriptionId);
    }

}
