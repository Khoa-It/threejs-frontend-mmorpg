import { EquipmentManager } from "../manager_system/EquipmentManager.js";

let selector = {
    bag: '#js-bag',
    open_bag_btn: '#js-bag-button',
    close_bag_btn: '#js-bag-close-btn'
}

$(document).ready(function () {
    $(selector.bag).hide();
    
    $(selector.open_bag_btn).click(function (e) { 
        e.preventDefault();
        $(selector.bag).show();
    });

    $(selector.close_bag_btn).click(function (e) { 
        e.preventDefault();
        $(selector.bag).hide();
    });

    EquipmentManager.setAllItemHtml();
    EquipmentManager.setDetailItemHtml();
    EquipmentManager.setFirstItemDetailHtml();
});