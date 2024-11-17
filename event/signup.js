import { ApiData } from "../web_data/ApiData.js";

$(document).ready(function () {
    alert('okee')
    const selector = {
        username : '#username',
        password : '#password',
        email : '#email',
        submit : '#submit'
    };

    $(selector.submit).click(async function (e) { 
        e.preventDefault();
        const username = $(selector.username).val();
        const password = $(selector.password).val();
        const email = $(selector.email).val();
        
        if(!username || !password || !email){
            alert('vui lòng nhập đầy đủ thông tin !');
            return;
        }

        const result = await ApiData.register({username, password, email});

        if(!result || !result.data ){
            alert('Tạo tài khoản mới thất bại !');
            return;
        }
        
        console.log('Đăng ký thành công !');
        sessionStorage.setItem('user', JSON.stringify(result.data));
        window.location.href = '/index.html';
    });
});