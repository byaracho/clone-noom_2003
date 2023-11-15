const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

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
  socket.send(input.value);
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);