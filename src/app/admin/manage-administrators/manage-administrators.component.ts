import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar, MatTableDataSource} from '@angular/material';
import {StaffsService} from '../../services/staffs.service';
import {Staff} from '../../models/staff';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-manage-administrators',
    templateUrl: './manage-administrators.component.html',
    styleUrls: ['./manage-administrators.component.scss']
})
export class ManageAdministratorsComponent implements OnInit {
    staffs;
    searchedStaffs = [];

    displayedColumns: string[] = ['name', 'phoneNumber', 'role', 'action'];
    dataSource: any = new MatTableDataSource(this.searchedStaffs);

    constructor(private authService: AuthService, private staffsService: StaffsService, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.staffs = this.staffsService.staffs;

        this.staffs.forEach((staff) => {
            if (staff.id !== this.authService.loggedInStaff.id) {
                this.searchedStaffs.push(staff);
            }
        });
    }

    setAdmin(staff: Staff, set: boolean) {
        this.staffsService.updateStaff(staff.id, 'admin', set);
        this.searchedStaffs = [];
        this.staffs.forEach((s) => {
            if (s.id === staff.id) {
                s.admin = set;
            }

            if (s.id !== this.authService.loggedInStaff.id) {
                this.searchedStaffs.push(s);
            }
        });

        if (set) {
            this.snackBar.open(staff.name + ' made administrator.', 'Dismiss', {duration: 3000});
        } else {
            this.snackBar.open('Administrator privileges revoked from ' + staff.name, 'Dismiss', {duration: 3000});
        }
    }

}
