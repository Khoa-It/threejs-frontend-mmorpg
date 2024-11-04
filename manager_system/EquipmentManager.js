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
        item_img: '#js-detail-item-img',
        equipment_notification: '#js-equipment-notification',
        equipment_notification_item: '.notification .notification-item',
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
            let img = EquipmentManager.getValueByIdAndKey(equipment_id, 'img');
            $(selectorfunc.item_group_name).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'group_name'));
            $(selectorfunc.item_name).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'name'));
            $(selectorfunc.item_main_property).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'main_property'));
            $(selectorfunc.item_main_value).html(EquipmentManager.getValueByIdAndKey(equipment_id, 'main_value'));
            $(selectorfunc.item_img).html(`<img src="${img ?? '/assets/equipments/flower.png'}" alt="">`);
        });
    }
    
    static setFirstItemDetailHtml(){
        $(this.selector.item).first().trigger('click');
    }

    static timeDelay = 1000;
    static resetTime = {
        did: false,
        count: 0,
    };
    static addEquipmentNotification(equipmentId){
        let equipment = this.data[equipmentId];
        let uniqueId = `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        let content = `<div id="${uniqueId}" class="notification-item show">
        Đã nhận được trang bị: <span class="notification-item-equipname">${equipment.name}</span>
      </div>`

        setTimeout(() => {
            $(this.selector.equipment_notification).append(content);    
            this.resetTime.count +=1;
            this.resetTime.did = true;
        }, 500);

        setTimeout(() => {
            $(`#${uniqueId}`).remove();
            this.resetTime.count -=1;
        }, this.timeDelay);

        this.timeDelay += 1000;

        if (this.resetTime.count == 0 && this.resetTime.did) {
            this.timeDelay = 1000;
            this.resetTime.did = false;
        }
    }

    static updateAllItemHtml(){
        this.setAllItemHtml();
        this.setFirstItemDetailHtml();
    }

    static addEquipmentByMonster(monsterId){
        const userId = UserManager.getUserId();
        for (const equipmentId in this.data) {
            let equipment = this.data[equipmentId];
            if (equipment.monsters && equipment.monsters.includes(monsterId)) {
                equipment.quantity[userId] = 1;
                this.addEquipmentNotification(equipmentId);
            }
        }
        this.updateAllItemHtml();
    }
}