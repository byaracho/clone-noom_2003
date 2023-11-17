const socket = io(); // socket.io를 실행하고 있는 서버 찾기

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  }); // new_message 이벤트 발생 - 서버에 input, roomName, 콜백함수(addMessage) 같이 전달
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit); // 폼에서 적은 메시지 처리하기 위해 이벤트 핸들러 함수 추가
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

socket.on("welcome", () => {
  addMessage("someone joined!");
})

socket.on("bye", () => {
  addMessage("someone left ㅠㅠ");
})

socket.on("new_message", (msg) => {
  addMessage(msg);
})