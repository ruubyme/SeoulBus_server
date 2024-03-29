const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const User = require("./models/User");
const FavoriteStation = require("./models/FavoriteStation");

dotenv.config();
const API_KEY = process.env.BUS_API_KEY;

const router = express.Router();

router.get("/", async (req, res) => {
  //클라이언트에서 전송한 uuid가 있는지 확인
  console.log("req.cookies:", req.cookies);
  const userUUID = req.cookies && req.cookies.userUUID;

  if (!userUUID) {
    const newUserUUID = uuidv4();
    res.cookie("userUUID", newUserUUID, { maxAge: 900000, httpOnly: true });

    try {
      const newUser = new User({ uuid: newUserUUID });
      await newUser.save();
      res.json({ uuid: newUserUUID });
      return;
    } catch (error) {
      console.error("Error adding user to the database: ", error);
    }
  } else {
    console.log("이미 uuid 있음");
  }

  // res.send("Hello World!");
  // res.send(results).status(200);
});

/**정류소 검색 후 키워드에 맞는 정류소 리스트 조회 */
router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;
    const url = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByName?ServiceKey=${API_KEY}&stSrch=${keyword}&resultType=json`;
    const response = await axios.get(url, cors());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: search");
  }
});

/**한 정류소의 모든 노선 조회 */
router.get("/busRoutes", async (req, res) => {
  try {
    const { arsId } = req.query;
    const url = `http://ws.bus.go.kr/api/rest/stationinfo/getRouteByStation?ServiceKey=${API_KEY}&arsId=${arsId}&resultType=json`;
    const response = await axios.get(url, cors());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: busRoutes");
  }
});

/**특정 버스의 정류소 순번 조회 */
router.get("/stationOrd", async (req, res) => {
  try {
    const { busRouteId } = req.query;
    const url = ` http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute?ServiceKey=${API_KEY}&busRouteId=${busRouteId}&resultType=json`;
    const response = await axios.get(url, cors());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: stationOrd");
  }
});

/**한 정류소의 특정노선의 도착예정정보 조회 (정류소ID, 노선ID) */
router.get("/busArriveInfo", async (req, res) => {
  try {
    const { stId, busRouteId, seq } = req.query;
    const url = `http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute?ServiceKey=${API_KEY}&stId=${stId}&busRouteId=${busRouteId}&ord=${seq}&resultType=json`;
    const response = await axios.get(url, cors());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: bus");
  }
});

/** 다음 정류장 이름*/
router.get("/nextStations", async (req, res) => {
  try {
    const { busRouteId } = req.query;
    const url = `http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute?ServiceKey=${API_KEY}&busRouteId=${busRouteId}&resultType=json`;
    const response = await axios.get(url, cors());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: nextStations");
  }
});

/**정류소 좌표로 조회 */
router.get("/searchBusStationPos", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const url = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?ServiceKey=${API_KEY}&tmX=${longitude}&tmY=${latitude}&radius=10&resultType=json`;
    const response = await axios.get(url, cors());
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: searchBusStationPos");
  }
});

/**즐겨찾는 정류장 리스트 조회 */
router.get("/bookmarks", async (req, res) => {
  const userUUID = req.cookies && req.cookies.userUUID;

  // if (!userUUID) {
  //   return res.status(400).send("User 정보가 없습니다.");
  // }

  try {
    const favoriteStation = await FavoriteStation.findOne({ uuid: userUUID });

    if (!favoriteStation || !favoriteStation.bookmarks) {
      return res.json([]);
    }
    return res.json(favoriteStation.bookmarks);
  } catch (error) {
    console.error("Error fetching Bookmarks: ", error);
    return res.status(500).send("Internal Server Error: get bookmarks");
  }
});

/**즐겨찾는 정류장 추가 */
router.post("/bookmakrs", async (req, res) => {
  const userUUID = req.cookies && req.cookies.userUUID;
  if (!userUUID) {
    return res.status(400).send("User 정보가 없습니다.");
  }

  if (!req.body) {
    return res.status(400).send("station 정보가 없습니다.");
  }

  try {
    let favoriteStation = await FavoriteStation.findOne({ uuid: userUUID });
    if (!favoriteStation) {
      favoriteStation = new FavoriteStation({ uuid: userUUID, bookmarks: [] });
    }
    favoriteStation.bookmarks.push(req.body);
    await favoriteStation.save();

    return res.send("Station added to bookmarks");
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return res.status(500).send("Internal Server Error: post bookmarks");
  }
});

/**즐겨찾는 정류장 삭제 */
router.delete("/bookmarks/:stationId", async (req, res) => {
  const userUUID = req.cookies && req.cookies.userUUID;

  if (!userUUID) {
    return res.status(400).send("User 정보가 없습니다.");
  }

  const stationId = req.params.stationId;

  try {
    const favoriteStation = await FavoriteStation.findOne({ uuid: userUUID });

    favoriteStation.bookmarks = favoriteStation.bookmarks.filter(
      (station) => station.stId !== stationId
    );
    await favoriteStation.save();

    return res.send("Station removed from bookmarks");
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return res.status(500).send("Internal Server Error: delete bookmarks");
  }
});

module.exports = router;
