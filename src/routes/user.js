const express   = require("express");
const router    = express.Router();
const checkAuth = require("../middleware/check_auth"); 
const { signup, login, delete_user } = require("../controllers/user");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/:userId", checkAuth, delete_user);

module.exports = router;
