import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {MessagesService} from '../../services/messages.service';
import {InvestigationsService} from '../../services/investigations.service';
import {PrescriptionsService} from '../../services/prescriptions.service';
import {TestsService} from '../../services/tests.service';
import {MedicinesService} from '../../services/medicines.service';
import {StaffsService} from '../../services/staffs.service';
import {PatientsService} from '../../services/patients.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    usernameCtrl = new FormControl();
    passwordCtrl = new FormControl();

    constructor(
        private authService: AuthService,
        private route: Router,
        private snackBar: MatSnackBar,
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

        if (this.authService.loggedIn) {
            this.route.navigateByUrl('/home');
        }
    }

    ngOnInit() {
    }

    login() {
        if (isNullOrUndefined(this.usernameCtrl.value) || isNullOrUndefined(this.passwordCtrl.value)) {
            this.snackBar.open('Fields cannot be empty.', 'Dismiss', {duration: 2000});
        } else {
            this.authService.login(this.usernameCtrl.value, this.passwordCtrl.value);
            if (this.authService.loggedIn) {
                this.snackBar.open('Welcome, ' + this.authService.loggedInStaff.name, 'Dismiss', {duration: 2000});
                this.route.navigateByUrl('/home');
            } else if (this.authService.inactive) {
                this.snackBar.open('Inactive account. Please contact your system administrator.', 'Dismiss', {duration: 4000});
            } else {
                this.snackBar.open('Invalid credentials. Login failed.', 'Dismiss', {duration: 4000});
            }
        }
    }

}
