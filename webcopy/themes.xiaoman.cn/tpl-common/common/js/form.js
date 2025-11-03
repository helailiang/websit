$(function () {
    // $.get('/aifeedback/save.php?act=checksend',{},function(data){});
    // 添加formFlag防止事件多次绑定
    if (typeof formFlag !== "undefined") return;
    formFlag = 1;

    var crmValidStr = "This field is required";
    var crmEmailStr = "Please enter a valid email address";
    var crmTelStr = "Phone format is incorrect";
    var crmFailedStr = "Send failed";
    var apiPath = $("#apiPath").attr("value");
    var siteId = $("#siteId").attr("value");
    var clientId = $("#clientId").attr("value");

    // 格式检验
    $(".crm-form, .invite-form")
        .find("input[name='tel']")
        .bind("keyup blur", function () {
            _crminputVali($(this), crmTelStr);
        });
    $(".crm-form, .invite-form")
        .find("input[name='email']")
        .bind("keyup blur", function () {
            _crminputVali($(this), crmEmailStr);
        });
    // 已填检验
    // $(".crm-form, .invite-form").find("input[name='name'],input[name='tel'],input[name='email']").bind("keyup blur",function(){
    //         _crminputVali($(this),crmValidStr);
    //     });
    /** 公共form input必填项输入失焦交互处理 */
    $(".crm-form form").find(":input[required]").bind("keyup blur", function () {
        _crminputVali($(this), crmValidStr, false)
    });

    $(".crm-form form").submit(function () {
        var form = $(this);

        if (!checkBeforeSubmit(form)) return false;

        form
            .find(".create-form-submit")
            .attr("disabled", "disabled")
            .append('<span class="crm-submit-load"></span>');

        var url = apiPath + "/managedata/aifeedback/add.php?";
        var serializedData = form.serialize();
        var dataObject = Object.fromEntries(new URLSearchParams(serializedData));
        dataObject.pagetitle = document.title;
        dataObject.page_link = window.location.href;
        var parseCookie = (value) =>
            value
                .split(";")
                .map((v) => v.split("="))
                .reduce((acc, v) => {
                    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(
                        v[1]?.trim()
                    );
                    return acc;
                }, {});
        dataObject.gclid = parseCookie(document.cookie).gclid || "";
        dataObject.site_session_id = window.matomo_site_id_cookie_key || "";
        var modifiedData = new URLSearchParams(dataObject).toString();

        $.post(
            url + $.param({ siteId: siteId, clientId: clientId }),
            modifiedData,
            function (result) {
                handleSubmitResult(form, result);
                console.log("result", result);
            },
            "json"
        );
        return false;
    });

    // 邮件订阅提交
    $(".invite-form").submit(function () {
        var form = $(this);
        if (!checkBeforeSubmit(form, true)) return false;
        form
            .find(".create-form-submit")
            .attr("disabled", "disabled")
            .append('<span class="crm-submit-load"></span>');
        $.post(
            apiPath +
            "/managedata/invitat.php?" +
            $.param({ siteId: siteId, clientId: clientId }),
            {
                email: $(this).find("input[name='email']").val(),
            },
            function (result) {
                handleSubmitResult(form, result, true);
                console.log("result", result);
            }
        );
    });

    function _crminputValiTel(item, text) {
        item.parent().find(".crmFormVali-error").remove();
        var value = $.trim(item.val());
        var tel_re = /^[0-9\s\+\-\_\(\)]*$/;
        if (value == "") return true;
        if (!tel_re.test(value)) {
            item.after('<div class="crmFormVali-error">' + text + "</div>");
            return false
        }
        return true;
    }
    function _crminputVali(item, text, isInvite = false) {
        item.parent().find(".crmFormVali-error").remove();
        var value = $.trim(item.val());
        var re =
            /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var tel_re = /^[0-9\s\+\-\_\(\)]*$/;
        if (item.attr("name") == "email") {
            if ((item.attr('required') || isInvite) && value == "") {
                item.after('<div class="crmFormVali-error">' + text + "</div>");
                return false;
            }
            if (value && !re.test(value)) {
                text = "Your email is invalid";
                item.after('<div class="crmFormVali-error">' + text + "</div>");
                return false
            }
            return true;
        } else if (item.attr("name") == "tel") {
            if (!value || !tel_re.test(value)) {
                item.after('<div class="crmFormVali-error">' + text + "</div>");
                return false
            }
            return true;
        } else if (!value) {
            item.after('<div class="crmFormVali-error">' + text + "</div>");
            return false;
        } else {
            return true;
        }
    }
    function _crmAlertText(type, text) {
        $("body").addClass("crm-body-clear");
        var succ =
            '<div id="crmMailMask"><div class="crmMailMask-box"><div class="crmMailMask-boxTop">' +
            text +
            '</div><div class="crmMailMask-boxBot"><button type="button" class="crmMailMask-close"> OK </button></div></div></div>';
        if (type == 0) {
            /** 失败时，不需要上报转化，转化触发器关联.crmMailMask-close类的点击，失败时移除button上面的转化器 */
            succ = '<div id="crmMailMask"><div class="crmMailMask-box"><div class="crmMailMask-boxTop">' +
            text +
            '</div><div class="crmMailMask-boxBot"><button type="button" class="crmMailMask-btn-cls"> OK </button></div></div></div>';
            $("body").find("#crmMailMask").remove();
            $("body").append(succ);
        } else if (type == 1) {
            $("body").find("#crmMailMask").remove();
            $("body").append(succ);
        }
        $(".crmMailMask-close").click(function () {
            $("#crmMailMask").remove();
            $("body").removeClass("crm-body-clear");
        });
        
        $(".crmMailMask-btn-cls").click(function () {
            $("#crmMailMask").remove();
            $("body").removeClass("crm-body-clear");
        });
    }

    function checkBeforeSubmit(form, isInvite = false) {
        var result = 0;
        form.find("input[name='email']").each(function () {
            if (!_crminputVali($(this), crmValidStr, isInvite)) {
                result = 1;
            }
        });
        /** 补充对非邮箱类型的校验处理 */
        form.find(":input[required]").each(function () {
            if (!_crminputVali($(this), crmValidStr, isInvite)) {
                result = 1;
            }
        });
        if (result) return false;
        return true;
    }

    function handleSubmitResult(form, result, isInvite = false) {
        try {
            form
                .find(".create-form-submit")
                .removeAttr("disabled")
                .find(".crm-submit-load")
                .remove();
            if (result.code == "0") {
                _crmAlertText(isInvite ? 0 : 1, "Send Succesfully!");
                form[0].reset();
                if (typeof gtag === "function") {
                    gtag("event", "Submit_form");
                }
                if (typeof gtag_report_conversion === "function") {
                    gtag_report_conversion();
                } else {
                    console.log("不存在谷歌表单函数");
                }
            } else {
                _crmAlertText(0, crmFailedStr);
            }
        } catch (error) {
            _crmAlertText(0, error.message || crmFailedStr);
        }
    }
});
