import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {StaffsService} from '../../services/staffs.service';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {Staff} from '../../models/staff';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'app-manage-staff',
    templateUrl: './manage-staff.component.html',
    styleUrls: ['./manage-staff.component.scss']
})
export class ManageStaffComponent implements OnInit, OnDestroy {
    showStaffForm = false;

    all = false;

    staffs;
    private staffsSub: Subscription;
    searchedStaffs = [];
    staff = new Staff();

    nameCtrl = new FormControl();
    usernameCtrl = new FormControl();
    passwordCtrl = new FormControl();
    phoneNumberCtrl = new FormControl();
    roleCtrl = new FormControl();

    nameSearchCtrl = new FormControl();
    phoneNumberSearchCtrl = new FormControl();

    active: boolean;

    displayedColumns: string[] = ['name', 'phoneNumber', 'role', 'action'];
    dataSource: any = new MatTableDataSource(this.searchedStaffs);

    constructor(private staffsService: StaffsService, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.staffs = this.staffsService.staffs;
        this.staffsSub = this.staffsService.getStaffUpdatedListener()
            .subscribe((staffs: Staff[]) => {
                this.staffs = staffs;
                // this.searchedStaffs = this.staffs;
            });
    }

    ngOnDestroy() {
        this.staffsSub.unsubscribe();
    }

    resetStaffForm() {
        this.nameCtrl.reset();
        this.usernameCtrl.reset();
        this.passwordCtrl.reset();
        this.phoneNumberCtrl.reset();
        this.roleCtrl.reset();
    }

    addStaff() {
        if (isNullOrUndefined(this.nameCtrl.value)) {
            this.snackBar.open('Please fill out all required fields.', 'Dismiss', {duration: 2000});
            return;
        }

        this.staff.id = null;
        this.staff.name = this.nameCtrl.value;
        this.staff.username = this.usernameCtrl.value;
        this.staff.password = this.passwordCtrl.value;
        this.staff.phoneNumber = this.phoneNumberCtrl.value;
        this.staff.role = this.roleCtrl.value;
        this.staff.active = true;
        this.staff.admin = false;

        this.staffsService.addStaff(this.staff);

        this.snackBar.open('Staff added successfully.', 'Dismiss', {duration: 2000});

        this.nameCtrl.reset();
        this.usernameCtrl.reset();
        this.passwordCtrl.reset();
        this.phoneNumberCtrl.reset();
        this.roleCtrl.reset();

        this.showStaffForm = false;
    }

    searchStaff(searchBy: string) {
        this.searchedStaffs = [];

        if (searchBy === 'name') {
            if (isNotNullOrUndefined(this.nameSearchCtrl.value) && this.nameSearchCtrl.value.length !== 0) {
                this.phoneNumberSearchCtrl.disable();
                this.staffs.forEach((staff) => {
                    if (staff.name.toLowerCase().startsWith(this.nameSearchCtrl.value.toLowerCase())) {
                        this.searchedStaffs.push(staff);
                    }
                });
            } else if (this.nameSearchCtrl.value.length === 0) {
                this.phoneNumberSearchCtrl.enable();
            }
        } else {
            if (isNotNullOrUndefined(this.phoneNumberSearchCtrl.value) && this.phoneNumberSearchCtrl.value.length !== 0) {
                this.nameSearchCtrl.disable();
                this.staffs.forEach((staff) => {
                    if (staff.phoneNumber.toLowerCase().startsWith(this.phoneNumberSearchCtrl.value.toLowerCase())) {
                        this.searchedStaffs.push(staff);
                    }
                });
            } else if (this.phoneNumberSearchCtrl.value.length === 0) {
                this.nameSearchCtrl.enable();
            }
        }
        this.dataSource = this.searchedStaffs;
        this.dataSource = [...this.dataSource];
    }

    openStaff(staffId: string) {
        console.log(staffId);
    }

    setActive(staffId: string, set: boolean) {
        this.staffsService.updateStaff(staffId, 'status', set);
        if (isNotNullOrUndefined(this.nameSearchCtrl.value)) {
            this.searchStaff('name');
        } else {
            this.searchStaff('phone');
        }
        this.active = set;
    }

}
