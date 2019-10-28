import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule
} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatDialogModule,
        MatSelectModule,
        MatSnackBarModule
    ],
    exports: [
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatDialogModule,
        MatSelectModule,
        MatSnackBarModule
    ]
})
export class MaterialModule {
}
