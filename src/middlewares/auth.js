const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../helper/ApiError");

const verifyCallback = (req, res, resolve, reject, roles) => {
  return async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
      );
    } else if (!roles.includes(user.role_id)) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized"));
    }
    req.user = user;

    resolve();
  };
};

const auth = (roles) => {
  return async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, res, resolve, reject, roles)
      )(req, res, next);
    })
      .then(() => {
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  };
};

module.exports = auth;
