const router = require("express").Router();
const { invalid } = require("@hapi/joi/lib/types/symbol");
const User = require("../model/user");
const { registerValidation, loginValidation } = require("../validation");
const crypto = require("crypto");

router.post("/register", async (req, res) => {
  // validate data using Joi
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send("Invalid Input");

  // checking the existence of the email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email Already In Use");

  // encrypt password using crypto
  let password = req.body.password;
  const key = "passwordencrypter";
  let encryptedPassword = crypto
    .createCipher("aes-256-ctr", key)
    .update(password, "utf8", "hex");

  // save a new user
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: encryptedPassword,
    address: req.body.address
  });

  // Saving process validation
  try {
    const savedUser = await user.save();
    res.send({ users: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send("Invalid Input");

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email Not In Use");

  let enteredPassword = req.body.password;
  const key = "passwordencrypter";
  let encryptedEnteredPassword = crypto
    .createCipher("aes-256-ctr", key)
    .update(enteredPassword, "utf8", "hex");

  if (encryptedEnteredPassword === user.password) {
    res.send("Done");
  } else {
    res.send("Not Done");
  }
});

module.exports = router;
