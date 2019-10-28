import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Prescription} from '../models/prescription';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionsService {
    public prescriptions: Prescription[] = [];
    private prescriptionsUpdated = new Subject<Prescription[]>();

    constructor(private http: HttpClient) { }

    getPrescriptions() {
        this.http
            .get<{ message: string, prescriptions: any }>(
                'http://localhost:3000/api/prescriptions'
            )
            .pipe(map((prescriptionData) => {
                return prescriptionData.prescriptions.map(prescription => {
                    return {
                        medicineId: prescription.medicineId,
                        doctorId: prescription.doctorId,
                        patientId: prescription.patientId,
                        dispensed: prescription.dispensed,
                        id: prescription._id
                    };
                });
            }))
            .subscribe(prescriptionData => {
                this.prescriptions = prescriptionData;
                this.prescriptionsUpdated.next([...this.prescriptions]);
            });
    }

    getPrescriptionUpdatedListener() {
        return this.prescriptionsUpdated.asObservable();
    }

    addPrescription(prescription: Prescription) {
        this.http.post<{ message: string, prescriptionId: string }>('http://localhost:3000/api/prescriptions', prescription)
            .subscribe((response) => {
                prescription.id = response.prescriptionId;
                this.prescriptions.push(prescription);
                this.prescriptionsUpdated.next([...this.prescriptions]);
            });
    }

    deletePrescription(prescriptionId: string) {
        this.http.delete('http://localhost:3000/api/prescriptions/delete/' + prescriptionId)
            .subscribe(() => {
                this.prescriptions = this.prescriptions.filter(prescription => prescription.id !== prescriptionId);
                this.prescriptionsUpdated.next([...this.prescriptions]);
            });
    }

    prescriptionDispensed(prescriptionId: string) {
        this.http.post<{message: string}>('http://localhost:3000/api/prescriptions/update/' + prescriptionId, null)
            .subscribe((response) => { });
        this.getPrescriptions();
    }

}
