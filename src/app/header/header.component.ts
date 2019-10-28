import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(private authService: AuthService, private route: Router) {
    }

    ngOnInit() {
        if (isNullOrUndefined(this.authService.loggedInStaff)) {
            this.route.navigateByUrl('');
        }
    }

    logout() {
        this.authService.loggedIn = false;
        this.authService.loggedInStaff = null;
        this.route.navigateByUrl('');
    }

}
