$(document).ready(function () {
    const selector = {
        shop_icon: '#js-shop-button',
        shop_window: '#js-shop',
        close_button: '#js-shop-close-btn',
    }    

    $(selector.shop_window).hide();

    $(selector.shop_icon).click(function (e) { 
        e.preventDefault();
        $(selector.shop_window).toggle();
    });

    $(selector.close_button).click(function (e) { 
        e.preventDefault();
        $(selector.shop_window).toggle();
    });
});