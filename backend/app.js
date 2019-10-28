const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Staff = require("./models/staff");
const Patient = require("./models/patient");
const EmergencyContact = require("./models/emergency-contact");
const Medicine = require("./models/medicine");
const Test = require("./models/test");
const Prescription = require('./models/prescription');
const Investigation = require('./models/investigation');
const Message = require('./models/message');

const app = express();


mongoose.connect("mongodb://localhost:27017/hospital-system")
    .then(() => {
        console.log("Connected to database!")
    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS, PUT"
    );
    next();
});

// staffs collection handlers below

app.post("/api/staffs", (req, res, next) => {
    const staff = new Staff({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        active: req.body.active,
        admin: req.body.admin
    });
    staff.save().then(newStaff => {
        res.status(201).json({
            message: "Staff added successfully",
            staffId: newStaff._id
        });
    });
});

app.get("/api/staffs", (req, res, next) => {
    Staff.find().then(documents => {
        res.status(200).json({
            message: "Staffs fetched successfully",
            staffs: documents
        });
    });
});

app.post("/api/staffs/update/:id", (req, res, next) => {
    if (req.body.update === 'status') {
        Staff.updateOne({_id: req.params.id}, {$set:{active: req.body.data}}, function (err, res) { });
    } else if (req.body.update === 'admin') {
        Staff.updateOne({_id: req.params.id}, {$set:{admin: req.body.data}}, function (err, res) { });
    } else if (req.body.update === 'username') {
        Staff.updateOne({_id: req.params.id}, {$set:{username: req.body.data}}, function (err, res) { });
    } else if (req.body.update === 'password') {
        Staff.updateOne({_id: req.params.id}, {$set:{password: req.body.data}}, function (err, res) { });
    }
});

// patients collection handlers below

app.post("/api/patients", (req, res, next) => {
    const patient = new Patient({
        name: req.body.name,
        mothersName: req.body.mothersName,
        gender: req.body.gender,
        address: req.body.address,
        emergencyContact: req.body.emergencyContact,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        dateOfLastAdmission: req.body.dateOfLastAdmission
    });
    patient.save().then(newPatient => {
        res.status(201).json({
            message: "Patient added successfully",
            patientId: newPatient._id
        });
    });
});

app.get("/api/patients", (req, res, next) => {
    Patient.find().then(documents => {
        res.status(200).json({
            message: "Patients fetched successfully",
            patients: documents
        });
    });
});

app.delete("/api/patients/:id", (req, res, next) => {
    Patient.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({message: "Patient deleted"})
    });
});

app.post("/api/patients/updateDiagnoses/:id", (req, res, next) => {
        Patient.updateOne({_id: req.params.id}, {$set:{diagnoses: req.body}}, function (err, res) { });
});


// emergency-contacts collection handlers below

app.post("/api/emergency-contacts", (req, res, next) => {
    const emergencyContact = new EmergencyContact({
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber
    });
    emergencyContact.save().then(newEmergencyContact => {
        res.status(201).json({
            message: "Emergency contact added successfully",
            emergencyContactId: newEmergencyContact._id
        });
    });
});

app.get("/api/emergency-contacts", (req, res, next) => {
    EmergencyContact.find().then(documents => {
        res.status(200).json({
            message: "Emergency contacts fetched successfully",
            emergencyContacts: documents
        });
    });
});


// medicines collection handlers below

app.post("/api/medicines", (req, res, next) => {
    console.log("inside app.post for /api/medicines");
    const medicine = new Medicine({
        medicineName: req.body.medicineName,
    });
    console.log(medicine);
    medicine.save().then(newMedicine => {
        res.status(201).json({
            message: "Medicine added successfully",
            medicineId: newMedicine._id
        });
    });
});

app.get("/api/medicines", (req, res, next) => {
    Medicine.find().then(documents => {
        res.status(200).json({
            message: "Medicines fetched successfully",
            medicines: documents
        });
    });
});

app.delete("/api/medicines/delete/:id", (req, res, next) => {
    Medicine.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({message: "Medicine deleted"})
    });
});


// tests collection handlers below

app.post("/api/tests", (req, res, next) => {
    const test = new Test({
        testName: req.body.testName,
    });
    test.save().then(newTest => {
        res.status(201).json({
            message: "Test added successfully",
            medicineId: newTest._id
        });
    });
});

app.get("/api/tests", (req, res, next) => {
    Test.find().then(documents => {
        res.status(200).json({
            message: "Tests fetched successfully",
            tests: documents
        });
    });
});

app.delete("/api/tests/delete/:id", (req, res, next) => {
    Test.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({message: "Test deleted"})
    });
});


// prescriptions collection handlers below

app.post("/api/prescriptions", (req, res, next) => {
    const prescription = new Prescription({
        medicineId: req.body.medicineId,
        doctorId: req.body.doctorId,
        patientId: req.body.patientId,
        dispensed: req.body.dispensed
    });
    prescription.save().then(newPrescription => {
        res.status(201).json({
            message: "Prescription added successfully",
            prescriptionId: newPrescription._id
        });
    });
});

app.get("/api/prescriptions", (req, res, next) => {
    Prescription.find().then(documents => {
        res.status(200).json({
            message: "Prescriptions fetched successfully",
            prescriptions: documents
        });
    });
});

app.delete("/api/prescriptions/delete/:id", (req, res, next) => {
    Prescription.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({message: "Prescription deleted"})
    });
});

app.post("/api/prescriptions/update/:id", (req, res, next) => {
    Prescription.updateOne({_id: req.params.id}, {$set:{dispensed: true}}, function (err, res) { });
});


// investigations collection handlers below

app.post("/api/investigations", (req, res, next) => {
    const investigation = new Investigation({
        testId: req.body.testId,
        doctorId: req.body.doctorId,
        patientId: req.body.patientId,
        done: req.body.done,
        results: req.body.results
    });
    investigation.save().then(newInvestigation => {
        res.status(201).json({
            message: "Investigation added successfully",
            investigationId: newInvestigation._id
        });
    });
});

app.get("/api/investigations", (req, res, next) => {
    Investigation.find().then(documents => {
        res.status(200).json({
            message: "Investigations fetched successfully",
            investigations: documents
        });
    });
});

app.delete("/api/investigations/delete/:id", (req, res, next) => {
    Investigation.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({message: "Investigation deleted"})
    });
});

app.post("/api/investigations/update/:id", (req, res, next) => {
    console.log(req.body.results);
    Investigation.updateOne({_id: req.params.id}, {$set:{results: req.body.results, done: true}}, function (err, res) { });
    // Investigation.updateOne({_id: req.params.id}, {$set:{done: true}}, function (err, res) { });
});


//messages collection handlers below

app.post("/api/messages", (req, res, next) => {
    const message = new Message({
        // senderId: req.body.senderId,
        // receiverId: req.body.receiverId,
        // message: req.body.message
        staffs: req.body.staffs,
        texts: req.body.texts
    });
    message.save().then(newMessage => {
        res.status(201).json({
            message: "Message added successfully",
            messageId: newMessage._id
        });
    });
});

app.get("/api/messages", (req, res, next) => {
    Message.find().then(documents => {
        res.status(200).json({
            message: "Messages fetched successfully",
            messages: documents
        });
    });
});

app.delete("/api/messages/delete/:id", (req, res, next) => {
    Message.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({message: "Message deleted"})
    });
});

app.post("/api/messages/update/:id", (req, res, next) => {
    Message.updateOne({_id: req.params.id}, {$set:{texts: req.body}}, function (err, res) {

    });
});


module.exports = app;
