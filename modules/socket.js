import { SocketManager } from "../manager_system/SocketManager.js";
import { UserManager } from "../manager_system/UserManager.js";

const PORT = 3030
// Tạo kết nối tới server
const socket = io(`http://localhost:${PORT}`);

const event = {
    connect: "connect",
    disconnect: "disconnect",
    welcome: "welcome",
    addNewPlayer: "addNewPlayer",
    updatePlayerList: "updatePlayerList",
}

// Khi client kết nối thành công
socket.on(event.connect, () => {
    console.log("Connected to server with ID:", socket.id);
    const param = {
        socket_id : socket.id,
        username : UserManager.getUsername(),
        user_id: UserManager.getUserId(),
    }
    socket.emit(event.addNewPlayer, param);
});

// Khi client nhận được thông báo "welcome"
socket.on(event.welcome, (data) => {
    console.log(data.message);
});

socket.on(event.updatePlayerList, (data) => {
    console.log('update other player', data);
    SocketManager.setotherPlayers(data);
})


// Khi client ngắt kết nối
socket.on(event.disconnect, () => {
    console.log("Disconnected from server");
});

// Export socket nếu cần sử dụng ở file khác
export default socket;
