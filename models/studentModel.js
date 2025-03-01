const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: Number, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    major: { type: String, required: true },
    gpa: { type: Number, required: true },
    enrollmentDate: { type: Date, required: true },
    graduationDate: { type: Date, required: false },
    isActive: { type: Boolean, default: false },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
