import { UserManager } from "../manager_system/UserManager.js";

const selector = {
    user_button: '#js-user-button',
    user_info_window: '#js-user-info-window',
    username: '#js-user-info-username',
    password: '#js-user-info-password',
    email: '#js-user-info-email',
}



$(document).ready(function () {    
    $(selector.username).val(UserManager.getUsername());
    $(selector.email).val(UserManager.getEmail());
    $(selector.user_button).click(function (e) {
        e.preventDefault();
        $(selector.user_info_window).toggleClass('visible');
        $(selector.user_info_window).toggleClass('hidden');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            $(selector.user_info_window).toggleClass('visible');
            $(selector.user_info_window).toggleClass('hidden');

        }
    })
});