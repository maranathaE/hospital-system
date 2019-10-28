import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {PatientsService} from '../../services/patients.service';
import {Patient} from '../../models/patient';
import {EmergencyContact} from '../../models/emergency-contact';
import {MatSnackBar} from '@angular/material';
import {Subscription} from 'rxjs';
import {__await} from 'tslib';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register-patient',
    templateUrl: './register-patient.component.html',
    styleUrls: ['./register-patient.component.scss']
})
export class RegisterPatientComponent implements OnInit, OnDestroy {
    emergencyContacts;
    private emergencyContactsSub: Subscription;

    nameCtrl = new FormControl();
    fathersNameCtrl = new FormControl();
    grandfathersNameCtrl = new FormControl();
    mothersNameCtrl = new FormControl();
    genderCtrl = new FormControl();
    ageCtrl = new FormControl();
    dateOfBirthCtrl = new FormControl();
    phoneNumberCtrl = new FormControl();
    cityCtrl = new FormControl();
    subCityCtrl = new FormControl();
    kebeleCtrl = new FormControl();
    houseNumberCtrl = new FormControl();
    // emergency contact details
    emergencyContactNameCtrl = new FormControl();
    emergencyContactPhoneNumberCtrl = new FormControl();
    emergencyContactCityCtrl = new FormControl();
    emergencyContactSubCityCtrl = new FormControl();
    emergencyContactKebeleCtrl = new FormControl();
    emergencyContactHouseNumberCtrl = new FormControl();

    registerButton = new FormControl();

    formGroup: FormGroup;

    patient = new Patient();
    emergencyContact = new EmergencyContact();


    constructor(public patientsService: PatientsService, private snackBar: MatSnackBar, private router: Router) {
        this.formGroup = new FormGroup({
            nameCtrl: this.nameCtrl,
            fathersNameCtrl: this.fathersNameCtrl,
            grandfathersNameCtrl: this.grandfathersNameCtrl,
            mothersNameCtrl: this.mothersNameCtrl,
            genderCtrl: this.genderCtrl,
            ageCtrl: this.ageCtrl,
            dateOfBirthCtrl: this.dateOfBirthCtrl,
            phoneNumberCtrl: this.phoneNumberCtrl,
            cityCtrl: this.cityCtrl,
            subCityCtrl: this.subCityCtrl,
            kebeleCtrl: this.kebeleCtrl,
            houseNumberCtrl: this.houseNumberCtrl,
            emergencyContactNameCtrl: this.emergencyContactNameCtrl,
            emergencyContactPhoneNumberCtrl: this.emergencyContactPhoneNumberCtrl,
            emergencyContactCityCtrl: this.emergencyContactCityCtrl,
            emergencyContactSubCityCtrl: this.emergencyContactSubCityCtrl,
            emergencyContactKebeleCtrl: this.emergencyContactKebeleCtrl,
            emergencyContactHouseNumberCtrl: this.emergencyContactHouseNumberCtrl
        });
    }

    ngOnInit() {
        this.emergencyContacts = this.patientsService.emergencyContacts;
        this.emergencyContactsSub = this.patientsService.getEmergencyContactUpdatedListener()
            .subscribe((emergencyContacts: EmergencyContact[]) => {
                this.emergencyContacts = emergencyContacts;
            });
    }

    ngOnDestroy() {
        this.emergencyContactsSub.unsubscribe();
    }

    addPatient() {
        this.patient.id = null;
        this.patient.phoneNumber = this.phoneNumberCtrl.value;
        this.patient.name = this.nameCtrl.value + ' ' + this.fathersNameCtrl.value + ' ' + this.grandfathersNameCtrl.value;
        this.patient.gender = this.genderCtrl.value;
        this.patient.dateOfBirth = new Date(this.dateOfBirthCtrl.value).getDate() + '/' +
            new Date(this.dateOfBirthCtrl.value).getMonth() + '/' +
            new Date(this.dateOfBirthCtrl.value).getFullYear();
        this.patient.dateOfLastAdmission =
            new Date(Date.now()).getDate() + '/' +
            new Date(Date.now()).getMonth() + '/' +
            new Date(Date.now()).getFullYear()/*Date.now().toString()*/;
        this.patient.mothersName = this.mothersNameCtrl.value;
        this.patient.address = this.cityCtrl.value + ', ' +
            this.subCityCtrl.value + ', ' +
            this.kebeleCtrl.value + ', ' +
            this.houseNumberCtrl.value;

        this.patient.emergencyContact = {
            name: this.emergencyContactNameCtrl.value,
            phoneNumber: this.emergencyContactPhoneNumberCtrl.value,
            address: this.emergencyContactCityCtrl.value + ', ' +
                this.emergencyContactSubCityCtrl.value + ', ' +
                this.emergencyContactKebeleCtrl.value + ', ' +
                this.emergencyContactHouseNumberCtrl.value
        };
        this.patient.diagnoses = [];

        this.patientsService.addPatient(this.patient);

        this.snackBar.open('Patient added successfully.', 'Dismiss', {duration: 2000});

        this.router.navigateByUrl('/home');

        this.registerButton.disable();
        this.formGroup.reset();
    }

}
