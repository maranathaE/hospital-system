import {Prescription} from './prescription';
import {Investigation} from './investigation';
import {Result} from './result';

export class Patient {
    id: string;
    name: string;
    mothersName: string;
    gender: string;
    address: string;
    emergencyContact: object;
    phoneNumber: string;
    dateOfBirth: string;
    dateOfLastAdmission: string;
    // datesOfAdmission: [];
    // observations: [];
    // investigations: Investigation[];
    // investigationResults: Result[];
    // prescriptions: Prescription[];
    diagnoses: [];
}
