const express           = require("express");
const router            = express.Router();
const checkAuth         = require("../middleware/check_auth");
const ordersController  = require("../controllers/orders");

router.get("/", checkAuth, ordersController.orders_get_all);
router.post("/", checkAuth, ordersController.create_new_order);
router.get("/:orderID", checkAuth, ordersController.get_single_order);
router.delete("/:orderID", checkAuth, ordersController.delete_order);

module.exports = router;
