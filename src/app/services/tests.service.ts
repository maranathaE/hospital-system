import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Test} from '../models/test';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  public tests: Test[] = [];
  private testsUpdated = new Subject<Test[]>();

    searchedTest;

  constructor(private http: HttpClient) { }

    getTest(testId: string) {
        this.searchedTest = {...this.tests.find(t => t.id === testId)};
        return this.searchedTest;
    }

  getTests() {
    this.http
        .get<{ message: string, tests: any }>(
            'http://localhost:3000/api/tests'
        )
        .pipe(map((testData) => {
          return testData.tests.map(test => {
            return {
              testName: test.testName,
              id: test._id
            };
          });
        }))
        .subscribe(testData => {
          this.tests = testData;
          this.testsUpdated.next([...this.tests]);
        });
  }

  getTestUpdatedListener() {
    return this.testsUpdated.asObservable();
  }

  addTest(test: Test) {
    this.http.post<{ message: string, testId: string }>('http://localhost:3000/api/tests', test)
        .subscribe((response) => {
          test.id = response.testId;
          this.tests.push(test);
          this.testsUpdated.next([...this.tests]);
        });
  }

  deleteTest(testId: string) {
    this.http.delete('http://localhost:3000/api/tests/delete/' + testId)
        .subscribe(() => {
          this.tests = this.tests.filter(test => test.id !== testId);
          this.testsUpdated.next([...this.tests]);
        });
  }

}
