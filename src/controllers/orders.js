const mongoose  = require("mongoose");
const Order     = require("../models/order");
const Product   = require("../models/product");

exports.orders_get_all = (req, res) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")

    .exec()
    .then((result) => {
      res.status(200).json({
        count: result.length,
        orders: result.map((item) => {
          const { _id, product, quantity } = item;
          return {
            _id,
            product,
            quantity,
            request: {
              type: "GET",
              url: `http://localhost:3000/orders/${_id}`,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.create_new_order = (req, res) => {
  Product.findById(req.body.productId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Not found product",
        });
      }
      const newOrder = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });

      return newOrder.save();
    })
    .then((result) => {
      const { _id, product, quantity } = result;
      res.status(201).json({
        message: "Order stored",
        createdOrder: { _id, product, quantity },
        request: {
          type: "POST",
          url: `http://localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_single_order = (req, res) => {
  const orderID = req.params.orderID;

  Order.findById(orderID)
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Not found order...",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.delete_order = (req, res) => {
  const _id = req.params.orderID;

  Order.remove({ _id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Success deleted order",
        request: {
          type: "DELETE",
          url: "http://localhost:3000/orders",
          body: {
            productId: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
