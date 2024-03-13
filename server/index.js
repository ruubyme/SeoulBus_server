const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = 3000;

app.use(cors());
app.use("/", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// /**한 정류소의 모든 노선 조회 */
// app.get("/busRoutes", async (req, res) => {
//   try {
//     const { arsId } = req.query;
//     const url = `http://ws.bus.go.kr/api/rest/stationinfo/getRouteByStation?ServiceKey=${API_KEY}&arsId=${arsId}&resultType=json`;
//     const response = await axios.get(url, cors());
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error: busRoutes");
//   }
// });

module.exports = app;
