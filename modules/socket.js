import { friend_updateMessage } from "../event/friend.js";
import { other_updateWindow } from "../event/other.js";
import { SocketManager } from "../manager_system/SocketManager.js";
import { UserManager } from "../manager_system/UserManager.js";

const PORT = 3030
// Tạo kết nối tới server
export const socket = io(`http://localhost:${PORT}`);

export const event = {
    connect: "connect",
    disconnect: "disconnect",
    welcome: "welcome",
    addNewPlayer: "addNewPlayer",
    updatePlayerList: "updatePlayerList",
    serverRequestAddFriend: "serverRequestAddFriend",
    clientRequestAddFriend: "clientRequestAddFriend",
    serverMessage: "serverMessage",
    clientMessage: "clientMessage",
    serverUpdateMessage: "serverUpdateMessage",
    clientUpdateMessage: "clientUpdateMessage",

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

socket.on(event.clientRequestAddFriend, () => {
    other_updateWindow();
})

socket.on(event.clientMessage, (param) => {
    friend_updateMessage(param);
})

socket.on(event.clientUpdateMessage, (param) => {
    friend_updateMessage(param);
})

// Khi client ngắt kết nối
socket.on(event.disconnect, () => {
    console.log("Disconnected from server");
});


