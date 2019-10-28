import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Medicine} from '../models/medicine';

@Injectable({
    providedIn: 'root'
})
export class MedicinesService {
    public medicines: Medicine[] = [];
    private medicinesUpdated = new Subject<Medicine[]>();

    searchedMedicine;

    constructor(private http: HttpClient) {
    }

    getMedicine(medicineId: string) {
        this.searchedMedicine = {...this.medicines.find(m => m.id === medicineId)};
        return this.searchedMedicine;
    }

    getMedicines() {
        this.http
            .get<{ message: string, medicines: any }>(
                'http://localhost:3000/api/medicines'
            )
            .pipe(map((medicineData) => {
                return medicineData.medicines.map(medicine => {
                    return {
                        medicineName: medicine.medicineName,
                        id: medicine._id
                    };
                });
            }))
            .subscribe(medicineData => {
                this.medicines = medicineData;
                this.medicinesUpdated.next([...this.medicines]);
            });
    }

    getMedicineUpdatedListener() {
        return this.medicinesUpdated.asObservable();
    }

    addMedicine(medicine: Medicine) {
        this.http.post<{ message: string, medicineId: string }>('http://localhost:3000/api/medicines', medicine)
            .subscribe((response) => {
                medicine.id = response.medicineId;
                this.medicines.push(medicine);
                this.medicinesUpdated.next([...this.medicines]);
            });
    }

    deleteMedicine(medicineId: string) {
        this.http.delete('http://localhost:3000/api/medicines/delete/' + medicineId)
            .subscribe(() => {
                this.medicines = this.medicines.filter(medicine => medicine.id !== medicineId);
                this.medicinesUpdated.next([...this.medicines]);
            });
    }

}
