const express             = require("express");
const multer              = require("multer");
const router              = express.Router();
const checkAuth           = require("../middleware/check_auth");
const productsControllers = require("../controllers/products");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    // fileSize: 1024 * 1024 * 5,
  },
});

router.get("/", productsControllers.get_all_products);
router.post("/", checkAuth, upload.single("productImage"), productsControllers.create_new_product);
router.get("/:productID", productsControllers.get_single_product);
router.patch("/:productID", checkAuth, productsControllers.update_product);
router.delete("/:productID", checkAuth, productsControllers.delete_product);

module.exports = router;
