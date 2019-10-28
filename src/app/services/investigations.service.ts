import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Investigation} from '../models/investigation';

@Injectable({
    providedIn: 'root'
})
export class InvestigationsService {
    public investigations: Investigation[] = [];
    private investigationsUpdated = new Subject<Investigation[]>();

    constructor(private http: HttpClient) {
    }

    getInvestigations() {
        this.http
            .get<{ message: string, investigations: any }>(
                'http://localhost:3000/api/investigations'
            )
            .pipe(map((investigationData) => {
                return investigationData.investigations.map(investigation => {
                    return {
                        testId: investigation.testId,
                        doctorId: investigation.doctorId,
                        patientId: investigation.patientId,
                        done: investigation.done,
                        results: investigation.results,
                        id: investigation._id
                    };
                });
            }))
            .subscribe(investigationData => {
                this.investigations = investigationData;
                this.investigationsUpdated.next([...this.investigations]);
            });
    }

    getInvestigationUpdatedListener() {
        return this.investigationsUpdated.asObservable();
    }

    addInvestigation(investigation: Investigation) {
        this.http.post<{ message: string, investigationId: string }>('http://localhost:3000/api/investigations', investigation)
            .subscribe((response) => {
                investigation.id = response.investigationId;
                this.investigations.push(investigation);
                this.investigationsUpdated.next([...this.investigations]);
            });
    }

    deleteInvestigation(investigationId: string) {
        this.http.delete('http://localhost:3000/api/investigations/delete/' + investigationId)
            .subscribe(() => {
                this.investigations = this.investigations.filter(investigation => investigation.id !== investigationId);
                this.investigationsUpdated.next([...this.investigations]);
            });
    }

    submitResults(investigationId: string, r: string) {
        const result = {results: r};
        this.http.post<{message: string}>('http://localhost:3000/api/investigations/update/' + investigationId, result)
            .subscribe((response) => { });
        this.getInvestigations();
    }

}
