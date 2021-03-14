const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const multer = require("multer");
const router = express.Router();

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

router.get("/", (req, res) => {
  Product.find()
    .select("name price _id productImg")
    .exec()
    .then((response) => {
      const resp = {
        count: response.length,
        data: response.map((item) => {
          const { name, price, _id, productImg } = item;
          return {
            name,
            price,
            _id,
            productImg,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${_id}`,
            },
          };
        }),
      };
      // additional check
      if (response.length >= 0) {
        res.status(200).json(resp);
      } else {
        res.status(404).json({
          message: "Not found records",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("productImage"), (req, res) => {
  console.log(req.file);

  const { name, price } = req.body;
  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    productImg: req.file.path,
    name,
    price,
  });

  newProduct
    .save()
    .then((result) => {
      const { name, price, _id } = result;
      res.status(201).json({
        message: "Success POST request",
        createdProduct: {
          name,
          price,
          _id,
          request: {
            type: "GET",
            url: `http://localhost:3000/products/${_id}`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:productID", (req, res) => {
  const id = req.params.productID;

  Product.findById(id)
    .select("name price _id productImg")
    .exec()
    .then((response) => {
      if (response) {
        res.status(200).json({
          data: response,
          request: {
            type: "GET",
            url: "http://localhost:3000/products",
          },
        });
      } else {
        res.status(404).json({
          message: `Not found product with ID: ${id}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productID", (req, res) => {
  const _id = req.params.productID;
  const updateOps = {};

  /** PM
     [
      {
        propName: "price",
        value: 1234567878,
      },
    ];  
   */

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.update({ _id }, { $set: updateOps })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Success updated product",
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${_id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:productID", (req, res) => {
  const _id = req.params.productID;

  Product.remove({ _id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Success deleted product",
        url: "http://localhost:3000/products",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
