import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {MatSnackBar} from '@angular/material';
import {isNullOrUndefined} from 'util';
import {StaffsService} from '../../services/staffs.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-manage-account',
    templateUrl: './manage-account.component.html',
    styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
    usernameCtrl = new FormControl();
    oldPasswordCtrl = new FormControl();
    newPasswordCtrl = new FormControl();

    updateUsername = false;
    updatePassword = false;

    constructor(private authService: AuthService,
                private staffsService: StaffsService,
                private snackBar: MatSnackBar,
                private router: Router) {
    }

    ngOnInit() {
        // this.usernameCtrl.setValue('');
        // this.oldPasswordCtrl.setValue('');
        // this.newPasswordCtrl.setValue('');
    }

    updateCredentials() {
        if (this.updateUsername) {
            if (isNullOrUndefined(this.usernameCtrl.value) || this.usernameCtrl.value.toString().trim() === '') {
                this.snackBar.open('You must enter a new username.', 'Dismiss', {duration: 3000});
                this.usernameCtrl.setValue('');
                return;
            } else {
                this.staffsService.updateStaff(this.authService.loggedInStaff.id, 'username', this.usernameCtrl.value);
            }
        }
        if (this.updatePassword) {
            if (isNullOrUndefined(this.oldPasswordCtrl.value) || this.oldPasswordCtrl.value.toString().trim() === '') {
                this.snackBar.open('You must enter your old password.', 'Dismiss', {duration: 3000});
                this.oldPasswordCtrl.setValue('');
                return;
            } else if (isNullOrUndefined(this.newPasswordCtrl.value) || this.newPasswordCtrl.value.toString().trim() === '') {
                this.snackBar.open('You must enter a new password.', 'Dismiss', {duration: 3000});
                this.newPasswordCtrl.setValue('');
                return;
            } else if (this.oldPasswordCtrl.value !== this.authService.loggedInStaff.password) {
                this.snackBar.open('Incorrect old password.', 'Dismiss', {duration: 3000});
                return;
            } else {
                if (this.oldPasswordCtrl.value === this.newPasswordCtrl.value) {
                    this.snackBar.open('Passwords are the same.', 'Dismiss', {duration: 3000});
                    return;
                } else {
                    this.staffsService.updateStaff(this.authService.loggedInStaff.id, 'password', this.newPasswordCtrl.value);
                }
            }
        }
        if (this.updateUsername || this.updatePassword) {
            this.snackBar.open('Login credentials updated.', 'Dismiss', {duration: 3000});
            this.router.navigateByUrl('/home');
        }
    }

}
