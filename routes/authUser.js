const router = require("express").Router();
const { invalid } = require("@hapi/joi/lib/types/symbol");
const User = require("../model/user");
const { registerValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // validate data using Joi
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send("Invalid Input");

  // checking the existence of the email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email Already In Use");

  // save a new user
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address
  });

  // Saving process validation
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
