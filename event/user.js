const selector = {
    user_button: '#js-user-button',
    user_info_window: '#js-user-info-window',

}
$(document).ready(function () {

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