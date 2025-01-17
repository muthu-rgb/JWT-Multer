const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validateMobile,
  validatePassword,
} = require("../functions/validation");
const secret = "fgfhgjasddkmjfhkdjKHGJGSKJGNBSNF";
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/getall", async (req, res, next) => {
  await User.find({ is_deleted: false })
    .then((data) => res.send({ success: true, data }))
    .catch(next);
});

router.get("/:id", async (req, res, next) => {
  await User.findOne({ _id: req.params.id, is_deleted: false })
    .then((data) => res.send({ success: true, data }))
    .catch(next);
});

router.post("/create", async (req, res, next) => {
  try {
    if (!validateEmail(req.body.email)) {
      res.status(400).send({ status: false, message: "Invalid email format!" });
      return;
    }

    if (!validateMobile(req.body.mobile)) {
      res
        .status(400)
        .send({ status: false, message: "Invalid mobile number format!" });
      return;
    }

    if (!validatePassword(req.body.password)) {
      res
        .status(400)
        .json({ status: false, message: "Invalid password format!" });
      return;
    }

    const existingUserByEmail = await User.findOne({
      email: req.body.email,
      is_deleted: false,
    });
    const existingUserByMobile = await User.findOne({
      mobile: req.body.mobile,
      is_deleted: false,
    });

    if (existingUserByEmail) {
      res.status(400).send({
        status: false,
        message: "User already exists with the same email!",
      });
      return;
    } else if (existingUserByMobile) {
      res.status(400).send({
        status: false,
        message: "User already exists with the same mobile!",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const user = {
      username: req.body.username,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword,
    };

    const data = await User.create(user);
    res.send({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      is_deleted: false
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user: { username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.params.id, is_deleted: false },
    { $set: req.body },
    { new: true }
  )
    .then((data) => res.send({ success: true, data }))
    .catch(next);
});

router.delete("/:id", async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { is_deleted: true } },
    { new: true }
  )
    .then((data) => res.send({ success: true, data }))
    .catch(next);
});

module.exports = router;
