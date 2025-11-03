$(function () {
  $(".zhuli-search, .mo-header-search").click(function () {
    $(".zhuli-search-box").toggle();
  });
  $(".zhuli-search-box .close").click(function () {
    $(".zhuli-search-box").hide();
  });

  $(".mo-header-menu").click(function () {
    $(".zhuli-mo-leftmenu").toggleClass("menu-transitioning");
  });
  $(".zhuli-mo-leftmenu .tit span").click(function () {
    $(".zhuli-mo-leftmenu").removeClass("menu-transitioning");
  });

  $(".zhu-down-btn").on('click', function () {

    $(this).parent('li').toggleClass("active");

    $(this).siblings('ul').slideToggle();

    return false;

  });

  // 顶部搜索栏提交搜索请求
  $('.search-box-only .submit_btn').click(function () {
    var formData = $(this).parents('.search-box-only').find('form').serialize();
    window.location.href = `/search?${formData}`;
  });

  // 语言切换
  var pathArr = location.pathname.split("/") || [];

  var lang = pathArr[1] || "en";
  var langList = [];
  $(".language-switch a").each(function () {
    langList.push($(this).data("lang"));
  });
  if (langList.includes(lang)) {
    var imgUrl = $(".zhuli-header-lang .box img").attr("src");
    var imgUrlSeg = imgUrl.split("/");
    imgUrlSeg[imgUrlSeg.length - 1] = lang + ".png";
    $(".zhuli-header-lang .box img").attr("src", imgUrlSeg.join("/"));
    $(".zhuli-header-lang .box em").text(lang.toUpperCase());
  }

  // $(window).scroll(function(){
  // 	//console.log($(this).scrollTop());
  // 	if($(this).scrollTop()>0 && window.innerWidth < 766){
  // 		$("body:not(.no-fix) .header-rightint2").addClass("header-fix");
  // 	}else{
  // 		$("body:not(.no-fix) .header-rightint2").removeClass("header-fix");
  // 	}
  // });
});
;
$(function () {
  var swiper = new Swiper("#zhuli-banner .swiper", {
    loop: true,
    autoplay: {
      delay: 4000,
      stopOnLastSlide: false,
      disableOnInteraction: true,
    },
    pagination: {
      el: "#zhuli-banner .swiper-pagination",
      clickable: true,
    },
  });
});
;
$(function () {
  var viewSwiper = new Swiper(".zhuli-swiper .view .swiper", {
    on: {
      slideChangeTransitionStart: function () {
        updateNavPosition();
      },
    },
  });

  $(".zhuli-swiper .preview .arrow-left").on("click", function (e) {
    e.preventDefault();
    if (viewSwiper.activeIndex == 0) {
      viewSwiper.slideTo(viewSwiper.slides.length - 1, 1000);
      return;
    }
    viewSwiper.slidePrev();
  });
  $(".zhuli-swiper .preview .arrow-right").on("click", function (e) {
    e.preventDefault();
    if (viewSwiper.activeIndex == viewSwiper.slides.length - 1) {
      viewSwiper.slideTo(0, 1000);
      return;
    }
    viewSwiper.slideNext();
  });

  var previewSwiper = new Swiper(".zhuli-swiper .preview .swiper", {
    //visibilityFullFit: true,
    direction: "horizontal",
    slidesPerView: 3,
    spaceBetween: 8,
    allowTouchMove: false,
    on: {
      tap: function (swiper, event) {
        viewSwiper.slideTo(previewSwiper.clickedIndex);
      },
    },
    breakpoints: {
      992: {
        direction: "vertical",
        slidesPerView: 4,
        spaceBetween: 12,
      },
      400: {},
    },
  });

  function updateNavPosition() {
    $(".zhuli-swiper .preview .active-nav").removeClass("active-nav");
    var activeNav = $(".zhuli-swiper .preview .swiper-slide")
      .eq(viewSwiper.activeIndex)
      .addClass("active-nav");
    if (!activeNav.hasClass("swiper-slide-visible")) {
      if (activeNav.index() > previewSwiper.activeIndex) {
        var thumbsPerNav =
          Math.floor(previewSwiper.width / activeNav.width()) - 1;
        previewSwiper.slideTo(activeNav.index() - thumbsPerNav);
      } else {
        previewSwiper.slideTo(activeNav.index());
      }
    }
  }
});
;
$(function() {
    var swiper3 = new Swiper ('.zhuli-swiper2 .swiper', {
          loop: true,
          autoplay: {
              delay:4000,
              stopOnLastSlide: false,
              disableOnInteraction: true,
          },
          pagination: {
              el: '.zhuli-swiper2 .swiper-pagination',
              clickable: true,
          }
      });
  })