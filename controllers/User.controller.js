const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const UserModel = require("../models/User.model");
class UserController {
  async add(req, res, next) {
    try {
      const {
        username,
        password,
        fullName,
        shortName,
        avatar,
        role,
        isEnabled,
      } = req.body;

      // ! check value request from client
      if (!username || !password || !fullName || !shortName || !role) {
        throw createError.BadRequest();
      }

      // ! check username is exist
      const existUser = await UserModel.findOne({ username: username });
      if (existUser) {
        throw createError.Conflict(`Tài khoản ${username} đã được đăng ký!`);
      }

      // TODO create user model and save to db
      const newUser = new UserModel({
        username,
        password,
        fullName,
        shortName,
        avatar,
        role,
        isEnabled: isEnabled ? true : isEnabled,
      });

      const savedUser = await newUser.save();
      const { password: passSaved, ...others } = savedUser._doc;
      res.json({
        message: "Đăng ký thành công!",
        user: { ...others },
      });
    } catch (error) {
      // ! Catch error
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await UserModel.find({}, { password: 0 });
      if (!users) {
        throw createError.NotFound("Không có dữ liệu trong hệ thống!");
      }
      res.json({
        message: "Lấy danh sách thành công",
        list: [...users],
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await UserModel.findById(req.params.id, { password: 0 });
      if (!user) throw createError.NotFound("Không tìm thấy người dùng!");
      res.json({
        message: "Tìm kiếm thành công!",
        user: user._doc,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError)
        next(createError.NotFound("ID không hợp lệ!"));
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { fullName, shortName, avatar, role, isEnabled } = req.body;
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { fullName, shortName, avatar, role, isEnabled },
        { new: true }
      );
      if (!user) {
        throw createError.NotFound("Không tìm thấy tài khoản!");
      }
      const { password, ...other } = user._doc;
      res.json({ user: other });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        next(createError.NotFound("ID không hợp lệ!"));
      }
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        throw createError.NotFound("Không tìm thấy tài khoản!");
      }
      res.json({ message: "Xóa thành công!" });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        next(createError.NotFound("ID không hợp lệ!"));
      }
      next(error);
    }
  }
}

module.exports = new UserController();
