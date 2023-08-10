const express = require("express");
const multer = require('multer');
const { isAuthorized } = require("../controllers/user");
const {sendMessage,receiveMessage} = require('../controllers/user-message')

const upload = multer();

const router = express.Router();

router.post("/", isAuthorized,upload.single('file'),  sendMessage);
router.get("/", isAuthorized,receiveMessage);


module.exports = router;
