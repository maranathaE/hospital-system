import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Staff} from '../models/staff';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class StaffsService {
    public staffs: Staff[] = [];
    private staffsUpdated = new Subject<Staff[]>();

    searchedStaff;

    constructor(private http: HttpClient) {
        this.getStaffs();
    }

    getStaff(staffId: string) {
        this.searchedStaff = {...this.staffs.find(s => s.id === staffId)};
        return this.searchedStaff;
    }

    getStaffs() {
        this.http
            .get<{ message: string, staffs: any }>(
                'http://localhost:3000/api/staffs'
            )
            .pipe(map((staffData) => {
                return staffData.staffs.map(staff => {
                    return {
                        name: staff.name,
                        username: staff.username,
                        password: staff.password,
                        phoneNumber: staff.phoneNumber,
                        role: staff.role,
                        active: staff.active,
                        admin: staff.admin,
                        id: staff._id
                    };
                });
            }))
            .subscribe(staffData => {
                this.staffs = staffData;
                this.staffsUpdated.next([...this.staffs]);
            });
    }

    getStaffUpdatedListener() {
        return this.staffsUpdated.asObservable();
    }

    addStaff(staff: Staff) {
        this.http.post<{ message: string, staffId: string }>('http://localhost:3000/api/staffs', staff)
            .subscribe((response) => {
                staff.id = response.staffId;
                this.staffs.push(staff);
                this.staffsUpdated.next([...this.staffs]);
            });
    }

    updateStaff(staffId: string, updateType: string, newData: boolean) {
        const updateData = {
            update: updateType,
            data: newData
        };
        this.http.post<{message: string}>('http://localhost:3000/api/staffs/update/' + staffId, updateData)
            .subscribe((response) => { });
        this.getStaffs();
        // this.staffsUpdated.next([...this.staffs]);
    }

}
