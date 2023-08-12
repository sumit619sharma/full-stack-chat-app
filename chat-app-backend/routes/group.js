const express = require("express");

const {  isAuthorized } = require("../controllers/user");
const {  createGroup,retrieveGroup } = require("../controllers/group");
const router = express.Router();

router.post("/create",isAuthorized, createGroup);
router.get("/matched",isAuthorized, retrieveGroup);
router.get("/get-user",isAuthorized, retrieveGroup);
router.post("/update",isAuthorized, retrieveGroup);

module.exports = router;
