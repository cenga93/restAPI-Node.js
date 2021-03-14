const express     = require("express");
const dotenv      = require("dotenv");
const path        = require("path");
const morgan      = require("morgan");
const connection  = require("./src/db/connection");
const app         = express();
const PORT        = process.env.PORT || 3000;

// import routes
const productRoutes = require("./src/routes/products");
const orderRoutes   = require("./src/routes/orders");
const userRoutes    = require("./src/routes/user");

// dotenv config
dotenv.config({ path: path.join(__dirname, "config.env") });

// init db onnection
connection();

// app config
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// prevent CORS errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin. X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    req.header("Access-Control-Allow-Methods", "PUT, PATCH, POST, DELETE, GET");
    return res.static(200).json({});
  }
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// load routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// 404 - not found
app.use((req, res, next) => {
  const notFoundError = new Error("Not found ;(");
  notFoundError.status = 404;

  /**
   * notFoundError.status  = 404
   * notFoundError.message = Not found ;(
   */
  next(notFoundError);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message });
});

// start server
app.listen(PORT, () => console.log(`Listening on port: http://localhost:${PORT}`));
