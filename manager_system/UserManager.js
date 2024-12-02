export class UserManager {
    static account = JSON.parse(sessionStorage.getItem('user'));

    // static account = {
    //     userId: 8,
    //     username: 'Nguyễn Đăng Khoa',
    //     email: 'ndk@gmail.com',   
    // }

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