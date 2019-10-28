import {Component, OnInit} from '@angular/core';
import {Investigation} from '../../models/investigation';
import {InvestigationsService} from '../../services/investigations.service';
import {StaffsService} from '../../services/staffs.service';
import {PatientsService} from '../../services/patients.service';
import {TestsService} from '../../services/tests.service';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'app-investigations',
    templateUrl: './investigations.component.html',
    styleUrls: ['./investigations.component.scss']
})
export class InvestigationsComponent implements OnInit {
    investigations;
    private investigationsSub: Subscription;

    resultCtrl = new FormControl();

    displayedInvestigationsColumns: string[] = ['test', 'patient', 'doctor', 'action'];

    constructor(
        private investigationsService: InvestigationsService,
        private patientsService: PatientsService,
        private staffsService: StaffsService,
        private testsService: TestsService,
        private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.investigations = this.investigationsService.investigations;

        this.investigationsSub = this.investigationsService.getInvestigationUpdatedListener()
            .subscribe((investigations: Investigation[]) => {
                this.investigations = investigations;

                for (let i = 0; i < this.investigations.length - 1; i++) {
                    if ((!this.investigations[i].done)) {
                        this.investigations[i].submit = false;
                    }
                }
            });
    }

    submitResults(investigationId: string) {
        if (isNullOrUndefined(this.resultCtrl.value)) {
            this.snackBar.open('Please enter an investigation result first.', 'Dismiss', {duration: 3000});
        } else {
            this.investigationsService.submitResults(investigationId, this.resultCtrl.value);
        }
    }

}
