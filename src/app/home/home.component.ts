import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {PatientsService} from '../services/patients.service';
import {StaffsService} from '../services/staffs.service';
import {MedicinesService} from '../services/medicines.service';
import {TestsService} from '../services/tests.service';
import {PrescriptionsService} from '../services/prescriptions.service';
import {InvestigationsService} from '../services/investigations.service';
import {MessagesService} from '../services/messages.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private patientsService: PatientsService,
        private staffsService: StaffsService,
        private medicinesService: MedicinesService,
        private testsService: TestsService,
        private prescriptionsService: PrescriptionsService,
        private investigationsService: InvestigationsService,
        private messagesService: MessagesService) {
        this.patientsService.getPatients();
        this.patientsService.getEmergencyContacts();
        this.staffsService.getStaffs();
        this.medicinesService.getMedicines();
        this.testsService.getTests();
        this.prescriptionsService.getPrescriptions();
        this.investigationsService.getInvestigations();
        this.messagesService.getMessages();
    }

    ngOnInit() {
    }

}
