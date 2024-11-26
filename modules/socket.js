const PORT = 3030
// Tạo kết nối tới server
const socket = io(`http://localhost:${PORT}`);

// Khi client kết nối thành công
socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
});

// Khi client nhận được thông báo "welcome"
socket.on("welcome", (data) => {
    console.log(data.message);
    alert(data.message); // Hiển thị thông báo chào mừng
});

// Khi client ngắt kết nối
socket.on("disconnect", () => {
    console.log("Disconnected from server");
    document.getElementById("status").innerText = "Disconnected";
});

// Export socket nếu cần sử dụng ở file khác
export default socket;
