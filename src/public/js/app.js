const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server");
})

socket.addEventListener("message", (message) => {
  console.log("Just got this:", message.data, "from the server");
})

socket.addEventListener("close", () => {
  console.log("Disconnected form Server");
})

setTimeout(() => {
  socket.send("hello from browser!");
}, 5000); // 브라우저에서 서버로 메시지 전달