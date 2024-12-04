import { UserManager } from "../manager_system/UserManager.js";
import { event, socket } from "../modules/socket.js";
import { ApiData } from "../web_data/ApiData.js";

const message = "friend.js";

const selector = {
    icon: '#js-friend-button',
    window: '#js-friend-window',
    close: '#js-friend-close-btn',
    listfriend: '#js-listfriend',
    friends: '.friend-info-listfriend-item',
    input: '#js-input-message',
    messages: '#js-messages',
}

let payload = {
    chat_room : "",
    message: "",
    reciver: 0,
    sender: UserManager.getUserId(),
} 

$(document).ready(function () {
    console.log(message);
    $(selector.window).hide();
    $(selector.icon).click(function (e) { 
        e.preventDefault();
        $(selector.window).show();
        updateWindow();
    });
    $(selector.close).click(function (e) { 
        e.preventDefault();
        $(selector.window).hide();
        $(selector.input).prop("disabled", true);
        $(selector.messages).html('');
    });
    $(document).on('click', selector.friends, function () {
        $(selector.input).prop("disabled", false);
        $(selector.friends).removeClass('active');
        $(this).addClass('active');
        const handid = $(this).data('id');
        const userid = UserManager.getUserId();
        payload.chat_room = handid < userid ? `${handid}#${userid}` : `${userid}#${handid}`;
        payload.reciver = handid;
        socket.emit(event.serverUpdateMessage, {
            userid: userid,
            chat_room: payload.chat_room,
        })
    });
    $(selector.input).keydown(function (e) { 
        if (e.key == 'Enter') {
            const message = ($(this).val()).trim();
            if (!message) return;
            payload.message = message;
            socket.emit(event.serverMessage, payload);
            $(this).val('');
        }
    });
});

const htmlListFriend = (myfriends) => {
    const htmlitem = (item) => {
        return `<div class="friend-info-listfriend-item" data-id="${item.userId}" >
          <p class="friend-info-listfriend-item-username">${item.username}</p>
        </div>`;
    }
    let htmlstr = ``;
    for (const element of myfriends) htmlstr += htmlitem(element);
    if (htmlstr == '') htmlstr = `<p>Không có bạn</p>`;
    return htmlstr;
}

const updateListFriend = async () => {
    const res = await ApiData.getMyFriends();
    const myfriends = res.data;
    console.log(myfriends);
    $(selector.listfriend).html(htmlListFriend(myfriends));
}

const generateHtmlMessages = (messages) => {
    if (!messages) return `<p> Không có tin nhắn </p>`;
    const userid = UserManager.getUserId();
    const htmlitem = (item) => {
        let classhandle = '';
        if (item.sender == userid) classhandle = 'friend-info-chatpanel-messages-owner';
        else classhandle = 'friend-info-chatpanel-messages-other';
        return `<p class="${classhandle}">${item.message}</p>`;
    }
    let htmlstr = '';
    for (const item of messages)  htmlstr += htmlitem(item);
    return htmlstr;
}

export const friend_updateMessage = (messages) => {
    $(selector.messages).html(generateHtmlMessages(messages));
    $(selector.messages).scrollTop($(selector.messages)[0].scrollHeight);
}

const updateWindow = () => {
    updateListFriend();
}