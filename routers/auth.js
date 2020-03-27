const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const HomePage = require('../models').homepage
const Story = require('../models').story;
const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ 
      where: { email }, 
      include: {
        model: HomePage,
        include: [Story],
        order: [[Story, 'createdAt', 'DESC']]
        }
       });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect"
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });

    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;
  //console.log('RESQUEST LOG',  req.body);
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }

  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name
    });

    delete newUser.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: newUser.id });
    console.log("USER AND NAME", newUser.id, newUser.name)
    const homepage = await HomePage.create({
      title: `${newUser.name}'s Page`,
      userId: newUser.id,
      description: 'This is a new description'
    })

    return res.status(201).json({ 
      token, 
      ...newUser.dataValues,
      homepage: {
        ...homepage.dataValues,
        stories: []
      }});

  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    } 
    next(error)
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  const homepage = await HomePage.findOne(
    {
      where: {userId: req.user.id},
      include: [Story]
  });
  // don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues, homepage });
});

module.exports = router;
