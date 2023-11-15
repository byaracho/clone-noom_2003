import http from "http";
import WebSocket from "ws";

import express from "express";

const app = express();

app.set("view engine", "pug"); // 뷰 엔진 pug로 설정
app.set("views", __dirname + "/views"); // 뷰 파일 폴더 지정
app.use("/public", express.static(__dirname + "/public")); // /`public` 경로가 `src/public` 임을 정의
app.get("/", (req, res) => res.render("home")); // HTTP 요청이 왔을 때 라우팅 처리할 뷰 파일
app.get("/*", (req, res) => res.redirect("/")); // HTTP 요청이 왔을 때 라우팅 처리할 주소

const handleListen = () => console.log("Listening on http://localhost:3000")

const server = http.createServer(app); // http 서버 생성
const wss = new WebSocket.Server({ server }); // 웹소켓 서버에 http 서버 전달

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser");
  socket.on("close", () => console.log("Disconnected from Browser"));
  socket.on("message", (message) => {
    sockets.forEach(aSocket => aSocket.send(`${message}`));
  });
}) // 첫번째 인자(connection) 발생 기다렸다가 두번째 인자인 익명 함수(콜백 함수) 호출

server.listen(3000, handleListen);
