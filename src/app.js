const express = require("express");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const routes = require("./route");
const { jwtStrategy } = require("./config/passport");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./helper/ApiError");
const path = require("path")

process.env.PWD = process.cwd();
process.env.TZ = "Asia/Jakarta";

const app = express();

// enable cors
app.use(cors());
app.options("*", cors());

// app.use(express.static(`${process.env.PWD}/public`));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);


app.get("/", async (req, res) => {
  res.status(200).send(`Congratulations! API is working in port ${process.env.PORT}`);
});
app.use("/api", routes);
app.use("/public", express.static(path.join(__dirname, '../')));


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
const db = require("./models");

// Uncomment this line if you want to sync database model
// db.sequelize.sync()

module.exports = app;
