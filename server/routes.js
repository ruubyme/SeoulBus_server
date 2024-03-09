// import axios from "axios";
// import dotenv from "dotenv";
// import cors from "cors";
// import app from "./index.mjs";
// import express from "express";

const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");

dotenv.config();
const API_KEY = process.env.VITE_API_KEY;

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
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

module.exports = router;
