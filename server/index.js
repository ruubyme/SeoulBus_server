const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const dotenv = require("dotenv");
const { connectDatabase, closeDatabase } = require("./database/conn");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", routes);

connectDatabase();

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//애플리케이션 종료 시 db 연결 닫기
process.on("SIGINT", async () => {
  try {
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});

//서버 종료 시 데이터베이스 연결닫기
server.on("close", async () => {
  try {
    await closeDatabase();
  } catch (error) {
    console.error("Error closing database connection: ", error);
  }
});

module.exports = app;
