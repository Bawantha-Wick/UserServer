const router = require("express").Router();
const { invalid } = require("@hapi/joi/lib/types/symbol");
const User = require("../model/user");
const { registerValidation, loginValidation } = require("../validation");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

// registration router
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

// login router
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send("Invalid Input");

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("Email Not In Use");

  // encrypt entered password
  let enteredPassword = req.body.password;
  const key = "passwordencrypter";
  let encryptedEnteredPassword = crypto
    .createCipher("aes-256-ctr", key)
    .update(enteredPassword, "utf8", "hex");

  // compare entered password with password stored in the database
  if (encryptedEnteredPassword === user.password) {
    // create a token and pass that token as the response
    const tokenSecret = "aa$#@kkj&*klkald!@kjkdfs$ksdfk%asdl#";
    const token = JWT.sign({ _id: user._id, email: user.email }, tokenSecret);
    res.header("auth-token", token).send(token);
  } else {
    res.send("Check Your Password");
  }
});

module.exports = router;
