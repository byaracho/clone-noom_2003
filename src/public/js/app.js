const socket = io(); // socket.io를 실행하고 있는 서버 찾기

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

// 이벤트 핸들러 함수: socket에 데이터를 보내는 역할
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, () => {
    console.log("server is done!");
  }); // emit: 원하는 이름의 이벤트 발생, 객체 전달 가능, 세번째 인자로 서버에서 호출할 콜백 함수 지정 가능
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);