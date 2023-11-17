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

function publicRooms() {
  // const sids = wsServer.sockets.adapter.sids;
  // const rooms = wsServer.sockets.adapter.rooms;
  const {
    sockets: {
      adapter: { sids, rooms },  // 구조 분해 할당
    },
  } = wsServer;

  const publicRooms = [];
  // map에서 forEach는 value, key 전달
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key)
    }
  })
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size; // ?연산자로 채팅룸이 있는 경우만 size 얻음
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.on("enter_room", (roomName, done) => {
    done(); // app.js에 작성된 showRoom 함수 호출
    socket.join(roomName); // 서버에 접속한 사용자를 room 단위로 묶는 기능
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms()); // 새로운 사용자가 접속할때 모든 채팅룸에 전달
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1) // 연결이 해제되기 직전이기 때문에 해제될 사람 수를 미리 빼줌
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  }); // disconnecting: 사용자와 연결이 완전히 해제되기 직전에 발생하는 이벤트, disconnect: 완전히 해제되었을 때 발생하는 이벤트
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
})

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);
