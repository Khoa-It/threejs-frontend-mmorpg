import { CURRENT_USER_DATA } from "../web_data/CurrentUserData.js";

export class UserManager {
    static data = CURRENT_USER_DATA;


    static getUserId(){
        return this.data.id;
    }

    static getCurrentCharId(){
        return this.data.cur_char_id;
    }
}