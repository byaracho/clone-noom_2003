const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload }
  return JSON.stringify(msg)
}

socket.addEventListener("open", () => {
  console.log("Connected to Server");
})

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
})

socket.addEventListener("close", () => {
  console.log("Disconnected form Server");
})

function handleSubmit(event) {
  event.preventDefault(); // 이벤트를 취소하는 메서드, 이벤트가 제공하는 원래 기능을 사용하지 않고자 할 때 사용
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value)) // 브라우저에서 JSON 객체를 문자열로 변환해서 서버로 전달
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  input.value = "";
}


messageForm.addEventListener("submit", handleSubmit);
messageForm.addEventListener("submit", handleNickSubmit);