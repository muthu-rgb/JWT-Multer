const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const Student = require("../models/studentModel");
require("dotenv").config();

const generateStudentCsv = async () => {
  try {
    const students = await Student.find({ is_deleted: false });

    if (students.length === 0) {
      console.log("No student records found.");
      return;
    }

    const uploadDir = path.join(__dirname, "..", process.env.UPLOADS_PATH);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, "students.csv");

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: "studentId", title: "Student ID" },
        { id: "firstName", title: "First Name" },
        { id: "lastName", title: "Last Name" },
        { id: "dateOfBirth", title: "Date of Birth" },
        { id: "email", title: "Email" },
        { id: "phoneNumber", title: "Phone Number" },
        { id: "address", title: "Address" },
        { id: "city", title: "City" },
        { id: "state", title: "State" },
        { id: "zipCode", title: "Zip Code" },
        { id: "major", title: "Major" },
        { id: "gpa", title: "GPA" },
        { id: "enrollmentDate", title: "Enrollment Date" },
        { id: "graduationDate", title: "Graduation Date" },
        { id: "isActive", title: "Active" },
      ],
    });

    const records = students.map((student) => ({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      dateOfBirth: student.dateOfBirth.toISOString().split("T")[0],
      email: student.email,
      phoneNumber: student.phoneNumber || "",
      address: student.address,
      city: student.city,
      state: student.state,
      zipCode: student.zipCode,
      major: student.major,
      gpa: student.gpa,
      enrollmentDate: student.enrollmentDate.toISOString().split("T")[0],
      graduationDate: student.graduationDate
        ? student.graduationDate.toISOString().split("T")[0]
        : "",
      isActive: student.isActive,
    }));

    await csvWriter.writeRecords(records);
    // console.log(`CSV file saved at ${filePath}`);
    console.log(`CSV file has saved `);
  } catch (error) {
    console.error("Error generating CSV file:", error);
  }
};

module.exports = generateStudentCsv;
