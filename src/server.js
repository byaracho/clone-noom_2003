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
  socket.on("enter_room", (roomName, done) => {
    done(); // app.js에 작성된 showRoom 함수 호출
    socket.join(roomName); // 서버에 접속한 사용자를 room 단위로 묶는 기능
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye"));
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  })
})

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);
