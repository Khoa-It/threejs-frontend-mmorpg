import { StatusInfoManager } from "../manager_system/StatusInfoManger.js";
import { UserManager } from "../manager_system/UserManager.js";
import { ApiData } from "../web_data/ApiData.js";

const selector = {
    icon: '#js-pay-button',
    window: '#js-payment-window',
    close_btn: '#js-payment-close-btn',
    submit: '#js-submit',
    username: '#js-username',
    email: '#js-email',
    bank: 'input[name="bank"]:checked',
    package: 'input[name="package"]:checked'

}

$(document).ready(function () {
    $(selector.window).hide();

    $(selector.icon).click(function (e) { 
        e.preventDefault();
        $(selector.window).show();
    });

    $(selector.close_btn).click(function (e) { 
        e.preventDefault();
        $(selector.window).hide();
    });


    $(selector.submit).click(async function (e) { 
        e.preventDefault();

        const param = {
            username: $(selector.username).val().trim(),
            email: $(selector.email).val().trim(),
            username: $(selector.username).val().trim(),
            bank: $(selector.bank).val(),
            package: $(selector.package).val(),
        }

        const hasNull = Object.values(param).some(val => val == null || val == '');
        if (hasNull) {
            alert('vui lòng nhập đầy đủ thông tin');
            return;
        }

        const result = await ApiData.payment(param);
        alert(result.message);
        console.log(result);
        const mora = result.mora;
        const curMora = StatusInfoManager.getMora(UserManager.getUserId());
        StatusInfoManager.setMora(UserManager.getUserId(), curMora + mora);
        $('#js-mora').text(mora + curMora);
        return;
    });
});