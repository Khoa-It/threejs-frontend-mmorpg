export class UserManager {
    static testData = {
        userId: 8,
        username: 'Nguyễn Đăng Khoa',
        email: 'ndk@gmail.com',
    }
    static account = JSON.parse(sessionStorage.getItem('user')) ?? this.testData;

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