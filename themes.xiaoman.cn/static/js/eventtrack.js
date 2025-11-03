$(function () {
  var lang = [
    "af",
    "am",
    "ar",
    "az",
    "be",
    "bg",
    "bn",
    "bs",
    "ca",
    "ceb",
    "cn",
    "co",
    "cs",
    "cy",
    "da",
    "de",
    "el",
    "en",
    "eo",
    "es",
    "et",
    "eu",
    "fa",
    "fi",
    "fr",
    "fy",
    "ga",
    "gd",
    "gl",
    "gu",
    "ha",
    "haw",
    "hi",
    "hmn",
    "hr",
    "ht",
    "hu",
    "hy",
    "id",
    "ig",
    "is",
    "it",
    "iw",
    "ja",
    "jw",
    "ka",
    "kk",
    "km",
    "kn",
    "ko",
    "ku",
    "ky",
    "la",
    "lb",
    "lo",
    "lt",
    "lv",
    "mg",
    "mi",
    "mk",
    "ml",
    "mn",
    "mr",
    "ms",
    "mt",
    "my",
    "ne",
    "nl",
    "no",
    "ny",
    "pa",
    "pl",
    "ps",
    "pt",
    "ro",
    "ru",
    "sd",
    "si",
    "sk",
    "sl",
    "sm",
    "sn",
    "so",
    "sq",
    "sr",
    "st",
    "su",
    "sv",
    "sw",
    "ta",
    "te",
    "tg",
    "th",
    "tl",
    "tr",
    "uk",
    "ur",
    "uz",
    "vi",
    "xh",
    "yi",
    "yo",
    "zu",
  ];

  function wdsv_IsEmail(str) {
    var reg = new RegExp(/[A-Za-z0-9.\-+_]+@[a-z0-9.\-+_]+\.[a-z]{2,3}/);
    var match = reg.exec(str);
    return match && match[0].trim();
  }
  function wdsv_IsTel(str) {
    var reg = new RegExp(/[\d\-()\s+]*\d{7,}[\d()\-\s,]*/);
    var match = reg.exec(str);
    return match && match[0].trim();
  }
  function wdsv_lang() {
    var url = location.pathname;
    var regex = new RegExp(/\/([^/]+)/);
    var match = regex.exec(url);
    var lan = match && lang.includes(match[1]) ? match[1] : "en";
    return lan;
  }
  function wdsv_logInfo(s, a) {
    const cur = location.href;
    // 判断环境 本地和预览不上报
    if (cur.startsWith("file://") || cur.includes("act=preview")) return;

    var tel = wdsv_IsTel(s);
    var email = wdsv_IsEmail(s);

    var apiPath = $("#apiPath").attr("value");
    var siteId = $("#siteId").attr("value");
    var clientId = $("#clientId").attr("value");
    var d = {
      page_url: window.location.href,
      clientId: clientId,
      siteId: siteId,
      action: a,
      timezone: 0 - new Date().getTimezoneOffset() / 60,
      language: wdsv_lang(),
    };

    var submitted = localStorage.getItem('savedEventTrackCopy');
    submitted = submitted ? JSON.parse(submitted) : {};

    if (tel && !submitted[tel]) {
      submitted[tel] = tel;
      d.content = tel;
    }

    if (email && !submitted[email]) {
      submitted[email] = email;
      d.content = email;
    }

    if (d.content) {
      localStorage.setItem('savedEventTrackCopy', JSON.stringify(submitted));
      var url = apiPath + "/shop-api/EventTracking/add";
      $.post( url, d, function (result) {
          console.log(result);
        }, "json"
      );
      return false;
    }
  }
  $("a").click(function (e) {
    if (e.target.innerText != "") {
      var s = e.target.href;
      var i = e.target.innerText;
      if (
        s?.substr(0, 1) != "/" &&
        s?.substr(0, 2) != "./" &&
        s?.substr(0, 11) != "javascript:"
      ) {
        wdsv_logInfo(i, 1);
      }
    }
  });
  document.oncopy = wdsv_copy;
  function wdsv_copy() {
    var selection;
    selection = window.getSelection();
    if (window.clipboardData) {
      var copytext = selection;
      wdsv_logInfo(copytext, 2);
      return false;
    } else {
      var copytext = selection;
      wdsv_logInfo(copytext, 2);
    }
  }
});
