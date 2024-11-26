export class UserManager {
    static account = JSON.parse(sessionStorage.getItem('user'));

    static getUserId(){
        return this.account.userId;
    }

    static getCurrentCharId(){
        return 'woman_warior';
    }

    static getEmail(){
        return this.account.email;
    }

    static getUsername(){
        return this.account.username;
    }
}