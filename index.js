// TODO import package
const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cors = require("cors");
require("dotenv").config();
require("./helpers/init_mongodb");

// TODO import route
const AuthRoute = require("./routes/Auth.route");
const UserRoute = require("./routes/User.route");
// TODO create App express
const app = express();

// TODO use App express
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
// TODO Setup Route
app.use("/auth", AuthRoute);
app.use("/users", UserRoute);

//! Handling Error 404
app.use(async (req, res, next) => {
  next(createError.NotFound("Route này không tồn tại"));
});

//! Handling Error
app.use(async (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

// TODO config PORT and listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sever is runing on port ${PORT}`);
});
