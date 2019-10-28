import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MedicinesService} from '../../services/medicines.service';
import {Medicine} from '../../models/medicine';
import {Test} from '../../models/test';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {TestsService} from '../../services/tests.service';

@Component({
    selector: 'app-records',
    templateUrl: './manage-resources.component.html',
    styleUrls: ['./manage-resources.component.scss']
})
export class ManageResourcesComponent implements OnInit, OnDestroy {
    medicines;
    private medicinesSub: Subscription;

    tests;
    private testsSub: Subscription;

    displayedMedicinesColumns: string[] = ['medicineName', 'action'];
    displayedTestsColumns: string[] = ['testName', 'action'];

    medicineCtrl = new FormControl();
    testCtrl = new FormControl();

    constructor(
        private medicinesService: MedicinesService,
        private testsService: TestsService,
        private snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        this.medicines = this.medicinesService.medicines;
        this.medicinesSub = this.medicinesService.getMedicineUpdatedListener()
            .subscribe((medicines: Medicine[]) => {
                this.medicines = medicines;
            });

        this.tests = this.testsService.tests;
        this.testsSub = this.testsService.getTestUpdatedListener()
            .subscribe((tests: Test[]) => {
                this.tests = tests;
            });
    }

    ngOnDestroy() {
        this.medicinesSub.unsubscribe();
        this.testsSub.unsubscribe();
    }

    addMedicine() {
        const newMedicine = new Medicine();
        newMedicine.medicineName = this.medicineCtrl.value;
        let add = true;
        this.medicines.forEach((medicine) => {
            if (medicine.medicineName === newMedicine.medicineName) {
                this.snackBar.open('Medicine already added.', 'Dismiss', {duration: 2000});
                add = false;
            }
        });

        if (add) {
            this.medicinesService.addMedicine(newMedicine);

            this.medicineCtrl.reset();

            this.snackBar.open('Medicine added successfully.', 'Dismiss', {duration: 2000});
        }
    }

    deleteMedicine(id: string) {
        this.medicinesService.deleteMedicine(id);

        this.snackBar.open('Medicine deleted successfully.', 'Dismiss', {duration: 2000});
    }

    addTest() {
        const newTest = new Test();
        newTest.testName = this.testCtrl.value;
        let add = true;
        this.tests.forEach((test) => {
            if (test.testName === newTest.testName) {
                this.snackBar.open('Test already added.', 'Dismiss', {duration: 2000});
                add = false;
            }
        });

        if (add) {
            this.testsService.addTest(newTest);

            this.testCtrl.reset();

            this.snackBar.open('Test added successfully.', 'Dismiss', {duration: 2000});
        }
    }

    deleteTest(id: string) {
        this.testsService.deleteTest(id);

        this.snackBar.open('Test deleted successfully.', 'Dismiss', {duration: 2000});
    }

}
