const UserModel = require("../models/User.model");
const JWT = require("jsonwebtoken");
const createError = require("http-errors");

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secrect = process.env.ACCESS_TOKEN_SECRECT;
    const options = {
      expiresIn: "1d",
      issuer: "ngminhduc1078@gmail.com",
      audience: userId,
    };
    JWT.sign(payload, secrect, options, (err, token) => {
      if (err) {
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  const secrect = process.env.ACCESS_TOKEN_SECRECT;
  JWT.verify(token, secrect, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};
const verifyTokenAndAdmin = async (req, res, next) => {
  await verifyAccessToken(req, res, async () => {
    if (!req.payload) {
      return next(createError.Unauthorized("Chưa xác thực token!"));
    }
    const user = await UserModel.findById(req.payload.aud);
    if (!user) {
      return next(
        createError.NotFound("Không tìm thấy tài khoản trong hệ thống!")
      );
    }
    if (!user.isAdmin) {
      return next(createError.Unauthorized("Không có quyền truy cập!"));
    }
    next();
  });
};
const verifyTokenAndAuthorization = async (req, res, next) => {
  await verifyAccessToken(req, res, async () => {
    if (!req.payload) {
      return next(createError.Unauthorized("Chưa xác thực token!"));
    }
    const user = await UserModel.findById(req.payload.aud);
    if (!user) {
      return next(
        createError.NotFound("Không tìm thấy tài khoản trong hệ thống!")
      );
    }
    if (!user.isAdmin) {
      if (req.payload.aud !== req.params.id) {
        return next(createError.Unauthorized("Không có quyền truy cập!"));
      }
      const userReq = await UserModel.findById(req.params.id);
      if (!userReq.isEnabled) {
        return next(createError.Unauthorized("Tài khoản đã bị vô hiệu hóa!"));
      }
    }
    next();
  });
};
module.exports = {
  signAccessToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
};
