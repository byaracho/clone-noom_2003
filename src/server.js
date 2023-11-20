import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug"); // 뷰 엔진 pug로 설정
app.set("views", __dirname + "/views"); // 뷰 파일 폴더 지정
app.use("/public", express.static(__dirname + "/public")); // /`public` 경로가 `src/public` 임을 정의
app.get("/", (req, res) => res.render("home")); // HTTP 요청이 왔을 때 라우팅 처리할 뷰 파일
app.get("/*", (req, res) => res.redirect("/")); // HTTP 요청이 왔을 때 라우팅 처리할 주소

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  }); // 브라우저에서 오퍼와 채팅룸 이름을 보내서 해당 채팅룸에 접속하는 모든 사용자에게 offer 이벤트와 offer 객체 전달
});

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);
