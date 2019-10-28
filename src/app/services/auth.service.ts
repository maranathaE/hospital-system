import {Injectable} from '@angular/core';
import {Staff} from '../models/staff';
import {Subscription} from 'rxjs';
import {StaffsService} from './staffs.service';
import {MatSnackBar} from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedIn = false;
    inactive = false;
    isAdmin = false;

    loggedInStaff;

    staffs;
    private staffsSub: Subscription;

    constructor(private staffsService: StaffsService, private snackBar: MatSnackBar) {
        this.staffs = this.staffsService.staffs;
        this.staffsSub = this.staffsService.getStaffUpdatedListener()
            .subscribe((staffs: Staff[]) => {
                this.staffs = staffs;
            });
    }

    login(username: string, password: string) {
        this.inactive = false;
        this.isAdmin = false;
        this.loggedInStaff = null;

        this.staffsService.staffs.forEach((staff) => {
            if (staff.username === username && !staff.active) {
                this.inactive = true;
            } else if (staff.username === username && staff.password === password) {
                this.loggedIn = true;
                this.loggedInStaff = staff;

                if (staff.admin) {
                    this.isAdmin = true;
                }
            }
        });
    }
}
