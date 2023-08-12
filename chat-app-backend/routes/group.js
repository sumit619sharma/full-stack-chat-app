const express = require("express");

const {  isAuthorized } = require("../controllers/user");
const {  createGroup,retrieveGroup, getUsersByGroupId,updateGroup } = require("../controllers/group");
const router = express.Router();

router.post("/create",isAuthorized, createGroup);
router.get("/matched",isAuthorized, retrieveGroup);
router.get("/get-user/:id",isAuthorized, getUsersByGroupId);
router.post("/update",isAuthorized, updateGroup);

module.exports = router;
