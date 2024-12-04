import { SocketManager } from "../manager_system/SocketManager.js";
import { event, socket } from "../modules/socket.js";
import { ApiData } from "../web_data/ApiData.js";

const selector = {
    icon: '#js-other-button',
    panel: '#js-other-panel',
    close: '#js-other-close-btn',
    window: '#js-other-window',
    addfriend: '.js-addfriend-btn',
}
const test_message = "other.js"


$(document).ready(function () {
    $(selector.window).hide();
    other_updateWindow();
    $(selector.icon).click(function (e) { 
        e.preventDefault();
        $(selector.window).show();
    });
    $(selector.close).click(function (e) { 
        e.preventDefault();
        $(selector.window).hide();
    });

    $(document).on('click', selector.addfriend, async function () {
        const otherId = $(this).data('id');
        const result = await ApiData.updateFriendship(otherId);
        other_updateWindow();
        const datasend = {
            message : "Send request addfriend",
        }
        socket.emit(event.serverRequestAddFriend,datasend);
    });

});

const generateHtml = () => {

    const htmlItem = (item) => {
        const disable_prop = item.info.allow_click ? '' : 'disabled';
        return `<div class="other-panel-item">
        <div class="other-panel-item-name">${item.username}</div>
        <button data-id="${item.user_id}" class="js-addfriend-btn" ${disable_prop} >${item.info.action}</button>
      </div>`
    }

    let htmlstr = '';
    for (const element of SocketManager.getOther()) {
        htmlstr += htmlItem(element);
    }

    if(htmlstr == '') htmlstr = `<p class='other-panel-note'>Không có người chơi nào khác</p>`
    return htmlstr;
}



export const other_updateWindow = async () => {
    await SocketManager.refreshFriendships();
    $(selector.panel).html(generateHtml());
}