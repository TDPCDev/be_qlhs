const createError = require("http-errors");
const UserModel = require("../models/User.model");
const { signAccessToken } = require("../middleware/VerifyToken.middleware");

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // ! Check value request from client
      if (!username || !password) {
        throw createError.BadRequest("username hoặc password không hợp lệ!");
      }

      // ! Check if user is not exist
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        throw createError.NotFound(
          `Tài khoản "${username}" chưa được đăng ký!`
        );
      }

      // !Check if pass is not match
      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        throw createError.Unauthorized("Mật khẩu không chính xác!");
      }

      // !Check if user is not enabled
      if (!user.isEnabled) {
        throw createError.Unauthorized("Tài khoản đã bị vô hiệu hóa!");
      }

      // TODO create token and return res to client
      const accessToken = await signAccessToken(user.id);
      const { shortName, avatar, role } = user;
      res.json({
        message: "Đăng nhập thành công!",
        user: { shortName, avatar, role },
        accessToken,
      });
    } catch (error) {
      // ! Catch error
      next(error);
    }
  }
}

module.exports = new AuthController();
