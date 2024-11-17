import * as THREE from 'three';
import { MODELS } from "../assets.js";
import { BrowserInfo } from "./info.js";
import { ApiData } from '../web_data/ApiData.js';

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
        email: '#email',
        password: '#password',
        submitButton: '#submit',
    }

    async function checkAccount(email, password) {
        try {
            const result = await ApiData.getAccount(email, password);
            const userData = result.data;
            if (result.data == null) return false
            sessionStorage.setItem("user", JSON.stringify(userData))
            return true;
        } catch (error) {
            console.log('exception in login.js file - check_account', error);
            return false;
        }

    }

    $(loginFormSelector.submitButton).click(async function (e) {
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

        const condition = await checkAccount(email, password);
        if (condition) {
            window.location.href = 'index.html';
            return;
        } else {
            alert('tài khoản mật khẩu chưa chính xác');
            return;
        }

    });
});