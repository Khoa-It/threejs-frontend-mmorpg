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
    });
    $(selector.input).keydown(function (e) { 
        if (e.key == 'Enter') {
            const message = $(this).val();
            alert(message);
        }
    });
});

const htmlListFriend = (myfriends) => {
    const htmlitem = (item) => {
        return `<div class="friend-info-listfriend-item">
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

const updateWindow = () => {
    updateListFriend();
}