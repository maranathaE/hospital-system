import {Injectable} from '@angular/core';
import {Patient} from '../models/patient';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {EmergencyContact} from '../models/emergency-contact';

@Injectable({
    providedIn: 'root'
})
export class PatientsService {
    public patients: Patient[] = [];
    private patientsUpdated = new Subject<Patient[]>();

    public emergencyContacts: EmergencyContact[] = [];
    private emergencyContactsUpdated = new Subject<EmergencyContact[]>();

    searchedPatient;
    emergencyContact;

    constructor(private http: HttpClient) {
    }

    getPatient(patientId: string) {
        this.searchedPatient = {...this.patients.find(p => p.id === patientId)};
        return this.searchedPatient;
    }

    getPatients() {
        this.http
            .get<{ message: string, patients: any }>(
                'http://localhost:3000/api/patients'
            )
            .pipe(map((patientData) => {
                return patientData.patients.map(patient => {
                    return {
                        name: patient.name,
                        mothersName: patient.mothersName,
                        gender: patient.gender,
                        address: patient.address,
                        emergencyContact: patient.emergencyContact,
                        phoneNumber: patient.phoneNumber,
                        dateOfBirth: patient.dateOfBirth,
                        dateOfLastAdmission: patient.dateOfLastAdmission,
                        diagnoses: patient.diagnoses,
                        id: patient._id
                    };
                });
            }))
            .subscribe(patientData => {
                this.patients = patientData;
                this.patientsUpdated.next([...this.patients]);
            });
    }

    getPatientUpdatedListener() {
        return this.patientsUpdated.asObservable();
    }

    addPatient(patient: Patient) {
        // const patient: Patient = {id: null, title: title, content: content};
        this.http.post<{ message: string, patientId: string }>('http://localhost:3000/api/patients', patient)
            .subscribe((response) => {
                patient.id = response.patientId;
                this.patients.push(patient);
                this.patientsUpdated.next([...this.patients]);
            });
    }

    getEmergencyContact(emergencyContactId: string) {
        this.getEmergencyContacts();
        this.emergencyContact = {...this.emergencyContacts.find(e => e.id === emergencyContactId)};
    }

    getEmergencyContacts() {
        this.http
            .get<{ message: string, emergencyContacts: any }>(
                'http://localhost:3000/api/emergency-contacts'
            )
            .pipe(map((emergencyContactData) => {
                return emergencyContactData.emergencyContacts.map(emergencyContact => {
                    return {
                        name: emergencyContact.name,
                        address: emergencyContact.address,
                        phoneNumber: emergencyContact.phoneNumber,
                        id: emergencyContact._id
                    };
                });
            }))
            .subscribe(emergencyContactData => {
                this.emergencyContacts = emergencyContactData;
                this.emergencyContactsUpdated.next([...this.emergencyContacts]);
            });
    }

    getEmergencyContactUpdatedListener() {
        return this.emergencyContactsUpdated.asObservable();
    }

    addEmergencyContact(emergencyContact: EmergencyContact) {
        this.http.post<{ message: string, emergencyContactId: string }>('http://localhost:3000/api/emergency-contacts', emergencyContact)
            .subscribe((response) => {
                emergencyContact.id = response.emergencyContactId;
                this.emergencyContacts.push(emergencyContact);
                this.emergencyContactsUpdated.next([...this.emergencyContacts]);
            });
    }

    deletePatient(patientId: string) {
        this.http.delete('http://localhost:3000/api/patients/' + patientId)
            .subscribe(() => {
                this.patients = this.patients.filter(patient => patient.id !== patientId);
                this.patientsUpdated.next([...this.patients]);
            });
    }

    addDiagnosis(patientId: string, diagnoses: []) {
        this.http.post<{message: string}>('http://localhost:3000/api/patients/updateDiagnoses/' + patientId, diagnoses)
            .subscribe((response) => { });
        this.getPatients();
    }

}
