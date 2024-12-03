import { other_updateWindow } from "../event/other.js";
import { ApiData } from "../web_data/ApiData.js";
import { UserManager } from "./UserManager.js";

export class SocketManager {

    static otherPlayers = [];
    static friendships = [];

    static setotherPlayers = (param) => {
        this.otherPlayers = param;        
        this.otherPlayers = this.otherPlayers.filter(item => item.user_id != UserManager.getUserId());
        other_updateWindow();
    }

    static setfriendships = (param) => {
        this.friendships = param;
    }

    static getotherPlayers() {
        return this.otherPlayers;
    }

    static getfriendships(){
        return this.friendships;
    }

    static checkFriend(id){
        if  (this.friendships.length == 0) return false;
        const userid = UserManager.getUserId();
        const res = this.friendships.find((item) => {
            const handle = `${item.userId1} - ${item.userId2}`;
            return handle.includes(id) && handle.includes(userid) && item.status == "accepted";   
        });
        return res != null;
    }

    static getOther(){
        const res = this.otherPlayers.filter(item => !this.checkFriend(item.user_id));
        for (const element of res) {
            element.info = this.actionForFriendship(element.user_id);
        }
        return res;
    }

    static actionForFriendship(id){
        const result = (act = "Kết bạn", allo = true) => {
            return {
                action: act,
                allow_click: allo,
            }
        }
        const userId = UserManager.getUserId();
        if(this.friendships.length == 0) return result();
        
        const res = this.friendships.find((item) => {
            const handle = `${item.userId1} - ${item.userId2}`;
            console.log(id, userId);
            
            console.log(handle.includes(id) && handle.includes(userId));
            return handle.includes(id) && handle.includes(userId);   
        });
        
        if(res == null) return result();
        return res.sender == UserManager.getUserId() ? result("Đã gửi",false) : result("Xác nhận");
    }

    static async refreshFriendships(){
        const res = await ApiData.getAllFriendShip(UserManager.getUserId());
        this.setfriendships(res.data);
    }
}