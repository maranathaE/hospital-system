import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'hospital-system';

    constructor(private authService: AuthService, private router: Router) {
        if (!authService.loggedIn) {
            router.navigateByUrl('');
        }
    }
}
