// routes/api.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/controller");
const auth = require("../middleware/auth");

router.post("/user/create", auth, userController.createUser);
router.put("/user/update", auth, userController.updateUser);
router.delete("/user/delete", auth, userController.deleteUser);
router.get("/user/list", auth, userController.listUsers);
router.get("/user/account", auth, userController.getUserAccount);

module.exports = router;
