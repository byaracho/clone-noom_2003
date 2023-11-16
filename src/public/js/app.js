const socket = io(); // socket.io를 실행하고 있는 서버 찾기

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
}

// 이벤트 핸들러 함수: socket에 데이터를 보내는 역할
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom); // enter_room 이벤트 발생 시 showRoom 호출
  // emit: 원하는 이름의 이벤트 발생, 객체 전달 가능, 세번째 인자로 서버에서 호출할 콜백 함수 지정 가능
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);