const router = require("express").Router();
const Student = require("../models/studentModel");
const { validateEmail, validateMobile } = require("../functions/validation");

router.get("/getall", async (req, res, next) => {
  await Student.find({ is_deleted: false })
    .then((data) => res.send({ success: true, data }))
    .catch(next);
});

router.get("/:id", async (req, res, next) => {
  await Student.findOne({ _id: req.params.id, is_deleted: false })
    .then((data) => res.send({ success: true, data }))
    .catch(next);
});

router.post("/create", async (req, res, next) => {
  try {
    if (!validateEmail(req.body.email)) {
      res.status(400).send({ status: false, message: "Invalid email format!" });
      return;
    }

    if (!validateMobile(req.body.phoneNumber)) {
      res
        .status(400)
        .send({ status: false, message: "Invalid mobile number format!" });
      return;
    }

    const existingStudentByEmail = await Student.findOne({
      email: req.body.email,
      is_deleted: false,
    });
    const existingStudentByMobile = await Student.findOne({
      mobile: req.body.phoneNumber,
      is_deleted: false,
    });

    if (existingStudentByEmail) {
      res.status(400).send({
        status: false,
        message: "Student already exists with the same email!",
      });
      return;
    } else if (existingStudentByMobile) {
      res.status(400).send({
        status: false,
        message: "Student already exists with the same mobile!",
      });
      return;
    }

    const student = {
      studentId: req.body.studentId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      major: req.body.major,
      gpa: req.body.gpa,
      enrollmentDate: req.body.enrollmentDate,
      graduationDate: req.body.graduationDate,
    };

    const data = await Student.create(student);
    res.send({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (req.body.email && !validateEmail(req.body.email)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid email format!" });
    }
    if (req.body.phoneNumber && !validateMobile(req.body.phoneNumber)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid mobile number format!" });
    }

    if (req.body.email) {
      const existingStudentByEmail = await Student.findOne({
        email: req.body.email,
        is_deleted: false,
        _id: { $ne: req.params.id },
      });
      if (existingStudentByEmail) {
        return res.status(400).send({
          status: false,
          message: "Another student already exists with the same email!",
        });
      }
    }

    if (req.body.phoneNumber) {
      const existingStudentByMobile = await Student.findOne({
        phoneNumber: req.body.phoneNumber,
        is_deleted: false,
        _id: { $ne: req.params.id },
      });
      if (existingStudentByMobile) {
        return res.status(400).send({
          status: false,
          message: "Another student already exists with the same mobile!",
        });
      }
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      { $set: req.body },
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .send({ status: false, message: "Student not found!" });
    }

    res.send({ success: true, data: updatedStudent });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  await Student.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { is_deleted: true } },
    { new: true }
  )
    .then((data) => res.send({ success: true, data }))
    .catch(next);
});

module.exports = router;
