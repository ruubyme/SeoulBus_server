const mongoose = require("mongoose");

const favoriteStationSchema = new mongoose.Schema({
  uuid: String,
  bookmarks: [
    {
      stId: String,
      stNm: String,
      arsId: String,
    },
  ],
});

const FavoriteStation = mongoose.model(
  "FavoriteStation",
  favoriteStationSchema
);

module.exports = FavoriteStation;
