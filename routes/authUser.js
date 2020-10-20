const router = require("express").Router();
const User = require("../model/user");
const Joi = require("@hapi/joi");

// Validation
const validatingSchema = {
  userName: Joi.string().max(50).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  address: Joi.string().max(255).required()
};

router.post("/register", async (req, res) => {
  // validate data using Joi
  const { error } = Joi.validate(req.body, validatingSchema);
  if (error) return res.status(400).send(error.details[0].message);

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
