const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "canBo", "lanhDao"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
// Run before save function
userSchema.pre("save", async function (next) {
  try {
    const hashedPass = CryptoJS.AES.encrypt(
      this.password,
      process.env.PASS_SEC
    );
    this.password = hashedPass;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    const hashedPassword = CryptoJS.AES.decrypt(
      this.password,
      process.env.PASS_SEC
    );
    const currentPass = hashedPassword.toString(CryptoJS.enc.Utf8);

    return currentPass === password;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
