import { EquipmentManager } from "../manager_system/EquipmentManager.js";
import { StatusInfoManager } from "../manager_system/StatusInfoManger.js";
import { UserManager } from "../manager_system/UserManager.js";

const selector = {
    shop_icon: '#js-shop-button',
    shop_window: '#js-shop',
    close_button: '#js-shop-close-btn',
    shop_panel_left: '#js-shop-panel-left',
    shop_panel_right: '#js-shop-panel-right',
    item: '.shop-items-left-item',
    buy_btn: '#js-buy-button',
    mora: '#js-mora',
}    

$(document).ready(function () {

    $(selector.shop_window).hide();

    $(selector.shop_icon).click(function (e) { 
        e.preventDefault();
        $(selector.shop_window).toggle();
    });

    $(selector.close_button).click(function (e) { 
        e.preventDefault();
        $(selector.shop_window).toggle();
    });

    update();

    $(document).on('click',selector.buy_btn, function () {
        const equipId = $(this).data('id');
        EquipmentManager.buy_item(equipId);
        update();
        $(this).hide();
    });
});

const generateHtml = () => {
    let res = ``;
    for (const [key,element] of Object.entries(EquipmentManager.data)) {
        if(!("shop" in element)) continue;
        if(element.not_show.includes(`id-${UserManager.getUserId()}`)) continue;
        res += `<div class="shop-items-left-item" data-id="${key}">
          <img src="${element.img}" alt="">
        </div>`;
    }
    return res;
}

const update = () => {
    $(selector.mora).text(StatusInfoManager.getMora(UserManager.getUserId()));
    $(selector.shop_panel_left).html(generateHtml());
    $(selector.item).click(function (e) { 
        e.preventDefault();
        const equipId = $(this).data('id');
        const equipment = EquipmentManager.getById(equipId);
        $(selector.shop_panel_right).html(generateHtmlInfoDetailItem(equipment,equipId));
    });
    
}

const generateHtmlInfoDetailItem = (item,id) => {
    return `<div class="shop-items-right-name">${item.name}</div>
        <div class="shop-items-right-info">
          <img src="${item.img}" alt="">
          <div class="shop-items-right-info-detail">
            ${EquipmentManager.formattedProperties(id)}
          </div>
        </div>
        <div class="shop-items-right-buy">
          <button data-id="${id}" id="js-buy-button">Mua</button>
        </div>`;
}