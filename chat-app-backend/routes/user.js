const express = require("express");

const { signUpUser,logInUser, searchUser } = require("../controllers/user");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", logInUser);
router.get('/matched', searchUser)

module.exports = router;
