const { model } = require("mongoose");
const { UserSchema } = require("../schemas/UserSchema");

const UsersModel = new model("user", UserSchema);

module.exports = { UsersModel };
