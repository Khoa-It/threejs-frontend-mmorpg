import * as THREE from 'three';
import { MODELS } from "../assets.js";
import { BrowserInfo } from "./info.js";

// const listener = new THREE.AudioListener();
// const sound = new THREE.Audio(listener);
// const audioLoader = new THREE.AudioLoader();


$(document).ready(function () {
    console.log(BrowserInfo.IS_LOGIN);
    

    // audioLoader.load(MODELS['music'].fantasy_world, function(buffer) {
    //     sound.setBuffer(buffer);
    //     sound.setLoop(true); // Bạn có thể bật hoặc tắt lặp lại
    //     sound.setVolume(0.5); // Đặt âm lượng từ 0.0 đến 1.0
    //     sound.play();
    // });

    const loginFormSelector = {
        email : '#email',
        password : '#password',
        sumitButton : '#submit',
    }

    function checkAccount(email, password) {
        if (email == 'nguyendangkhoa@gmail.com' && password == '123456') {
            return true;
        }
        return false;
    }

    $(loginFormSelector.sumitButton).click(function (e) { 
        e.preventDefault();
        const email = $(loginFormSelector.email).val();
        const password = $(loginFormSelector.password).val();
        
        if (!email) {
            alert('vui lòng email');
            return;
        }

        if (!password) {
            alert('vui lòng nhập password');
            return;
        }

        BrowserInfo.IS_LOGIN = checkAccount(email, password);

        if (BrowserInfo.IS_LOGIN) {
            console.log(BrowserInfo.IS_LOGIN);
            window.location.href = 'index.html';
            return;
        }else {
            alert('tài khoản mật khẩu chưa chính xác');
            return;
        }

    });
});