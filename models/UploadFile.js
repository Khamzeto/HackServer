const mongoose = require("mongoose");

const additionalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  avatarUrl: String,
  bannerUrl: String,
});

const AdditionalModel = mongoose.model("Additional", additionalSchema);

module.exports = AdditionalModel;
