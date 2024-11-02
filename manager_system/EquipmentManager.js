import { EQUIPMENT_DATA } from "../web_data/EquipmentData.js";
import { UserManager } from "./UserManager.js";

export class EquipmentManager {
    
    static data = EQUIPMENT_DATA;
    static selector = {
        all_item: '#js-bag-left',
        detail_item_info: '#js-bag-right',
        item: '.js-bag-left-item',
        item_group_name : '#js-equipment-groupname',
        item_name : '#js-equipment-name',
        item_main_property : '#js-equipment-main-property',
        item_main_value : '#js-equipment-main-value',
    }


    static getById(id){
        return this.data[id];
    }
    static getValueByIdAndKey(id, key){
        return this.data[id][key];
    }

    static setAllItemHtml(){
        let htmlstr = ``;
        let player_id = UserManager.getUserId();
        for (const key in this.data) {
            let element = this.data[key];
            if (element['quantity'].hasOwnProperty(player_id)) {
                htmlstr += `<div class="item js-bag-left-item" data-id="${key}"><img src="${element['img']}" alt=""></div>`;
            }
        }
        $(this.selector.all_item).html(htmlstr);
    }

    static setDetailItemHtml(){
        let selectorfunc = this.selector;
        $(document).on('click', selectorfunc.item , function () {
            let equipment_id = $(this).data('id');
            $(selectorfunc.item_group_name).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'group_name'));
            $(selectorfunc.item_name).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'name'));
            $(selectorfunc.item_main_property).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'main_property'));
            $(selectorfunc.item_main_value).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'main_value'));
        });
    }
    
    static setFirstItemDetailHtml(){
        $(this.selector.item).first().trigger('click');
    }

    static updateAllItemHtml(){
        this.setAllItemHtml();
        this.setFirstItemDetailHtml();
    }

}