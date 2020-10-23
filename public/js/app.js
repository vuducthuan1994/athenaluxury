$(document).ready(function() {
    $(".preloader").fadeOut(2000); // this will be active for 
    initMenuMobile();
    owlApartmentInit();
    owlDevelopmentProjectInit();
    owlDevelopmentController();
    owlNewsInit();
    owlDotsForPositionSlider();

    ScrollListener();
    owlLibaryOwlInit();
    activeRoute();
    initAnimationForAllSection();

});

function initMenuMobile() {
    var tlmenu = new TimelineMax({ paused: true });
    tlmenu.to('.navMobie', 0.3, { autoAlpha: 1 }).staggerFromTo('.navMobie li', 0.5, { y: 100, opacity: 0 }, { y: 0, opacity: 1 }, 0.1);
    $('#hamburger').click(function() {
        $(this).toggleClass('active');
        if ($('html').hasClass('is-main-menu-open')) {
            $('html').removeClass('is-main-menu-open');
            tlmenu.reverse(0);
        } else {
            tlmenu.play(0);
            $('html').addClass('is-main-menu-open');
        }
    });
    $('.closeButton').click(function() {
        tlmenu.reverse(0);
        $('html').removeClass('is-main-menu-open');
    });
    $(".navMobie ul li").click(function() {
        $('html').removeClass('is-main-menu-open');
        $('#hamburger').toggleClass('active');
        tlmenu.reverse(0);
    });
}

function owlApartmentInit() {
    // SLider mặt bằng căn hộ
    $('#owl-carousel-1').owlCarousel({
        lazyLoad: true,
        dotsContainer: '#owl-carousel-1-dots',
        items: 1,
        center: true,
        nav: false,
        dots: true,
        loop: true,
        autoplay: false
    });

    $('.typical-grounds h2').click(function() {
        $(`.apartment-left h2`).removeClass("active");
        $(this).addClass("active");
        $('#owl-carousel-1').trigger('to.owl.carousel', [$(this).data("slide"), 500]);
    });
}

function owlDevelopmentProjectInit() {
    $('#owl-carousel-2').owlCarousel({
        lazyLoad: true,
        items: 2,
        center: false,
        nav: false,
        autoHeight: true,
        dots: false,
        loop: true,
        autoplay: false,
        margin: 95
    });
}

function activeRoute() {
    $("header .nav li.nav-item").click(function(event) {
        $("header .nav li.nav-item").removeClass('active');
        $(this).addClass('active');
    });
}

function initAnimationForAllSection() {
    AOS.init({
        disable: !window.matchMedia('screen and (min-width: 1200px)').matches,
        duration: 700,
        easing: 'linear',
        once: false
    });
}

function owlDotsForPositionSlider() {
    $('#owl-carousel-5').owlCarousel({
        items: 2.5,
        nav: false,
        dots: false,
        autoplay: false,
        center: false,
        margin: 40,
        autoHeight: false,
        loop: true,
        lazyLoad: false,
        responsive: {
            0: { autoplay: false },
            768: {
                items: 1.764,
                margin: 40,
                autoHeight: false
            },
            1020: {

            }
        }
    });
    var owl5 = $('#owl-carousel-5');
    // Go to the next item of slider text
    $('.btn-next-position').click(function() {
        owl5.trigger('next.owl.carousel', [700]);
    });

    // Go to the previous item of sliderText
    $('.btn-prev-position').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl5.trigger('prev.owl.carousel', [700]);
    });
}

function owlNewsInit() {
    $('#owl-carousel-3').owlCarousel({
        items: 3,
        center: false,
        nav: false,
        autoHeight: true,
        dots: false,
        loop: true,
        autoplay: false,
        margin: 40,
        lazyLoad: true,
        responsive: {
            0: {
                items: 1.39,
                margin: 20,
                center: true,
                autoHeight: true
            },
            500: {
                items: 1.39,
                margin: 20,
                center: true,
                autoHeight: true
            },
            768: {
                items: 2,
                margin: 40,
                autoHeight: true
            }

        }
    });
    var owl3 = $('#owl-carousel-3');
    // Go to the next item of slider text
    $('.inner-news .btn-next-post').click(function() {
        owl3.trigger('next.owl.carousel', [700]);
        $('.inner-news .owl-controller .line').removeClass('active')
        $('.inner-news .owl-controller .line').addClass('active');
        setTimeout(function() { $('.inner-news .owl-controller .line').removeClass('active'); }, 500);
    });

    // Go to the previous item of sliderText
    $('.inner-news .btn-prev-post').click(function() {
        owl3.trigger('prev.owl.carousel', [700]);
        $('.inner-news .owl-controller .line').removeClass('active')
        $('.inner-news .owl-controller .line').addClass('active');
        setTimeout(function() { $('.inner-news .owl-controller .line').removeClass('active'); }, 500);
    });
}



function owlLibaryOwlInit() {
    $('#owl-carousel-6').owlCarousel({
        lazyLoad: true,
        items: 1,
        center: false,
        nav: false,
        video: true,
        autoHeight: false,
        dots: false,
        loop: true,
        autoplay: false,
        margin: 10,
        animateIn: 'fadeIn', // add this
        animateOut: 'fadeOut', // and this
        responsive: {
            0: { autoplay: false },
            768: {

                autoHeight: true
            },
            1020: {

            }
        },
        onTranslate: function(event) {
            var currentSlide, player, command;

            currentSlide = $('.owl-item.active');

            player = currentSlide.find(".item iframe").get(0);

            command = {
                "event": "command",
                "func": "pauseVideo"
            };

            if (player != undefined) {
                player.contentWindow.postMessage(JSON.stringify(command), "*");

            }

        },
        afterAction: function(current) {
            current.find('video').get(0).play();
        }
    });
    $('#owl-carousel-7').owlCarousel({
        lazyLoad: true,
        items: 3,
        center: false,
        nav: false,
        autoHeight: false,
        dots: false,
        loop: true,
        autoplay: false,
        mouseDrag: false,
        margin: 40,
        responsive: {
            0: {
                autoplay: false
            },
            768: {
                items: 2,
                autoplay: false,
                margin: 20

            },
            1020: {

            }
        }
    });
    var owl6 = $('#owl-carousel-6');
    var owl7 = $('#owl-carousel-7');

    owl6.on('changed.owl.carousel', function(e) {
        owl7.trigger('to.owl.carousel', e.item.index + 1);

    });
    $('.btn-next-libary').click(function() {
        owl6.trigger('next.owl.carousel', [700]);
    });
    $('.btn-prev-libary').click(function() {
        owl6.trigger('prev.owl.carousel', [700]);
    });

    const imagesList = ['/img/image-liabary-example.jpg', '/img/image-liabary-example-1.jpg', '/img/image-liabary-example-2.jpg', '/img/image-liabary-example-3.jpg'];
    const videoList = ['https://www.youtube.com/embed/Bc2663p7AHg', 'https://www.youtube.com/embed/hIEIGDsbKqY', 'https://www.youtube.com/embed/tx1A8g6DcbY'];
    const imagePrviewList = ['/img/image-liabary-example.jpg', '/img/image-liabary-example-1.jpg', '/img/image-liabary-example-2.jpg', '/img/image-liabary-example-3.jpg'];
    const videoPreviewImageList = ['https://tourduthuyenhalong.vn/wp-content/uploads/2019/05/athena-cruise-luxury.jpg', 'https://www.adventureindochina.com/files/thumb/758/508//uploads//Cruises/Athena-cruise/Signature-Mandarin-Cruise_19.jpg', 'https://funnytravelvietnam.com/files/thumb/758/508//uploads//Halong-bay-Cruises/Athena-Lux/athena_cruise_bath_room.jpg'];
    $('#btn-image-libary').click(function() {
        $('.image-libary-right-menu li').removeClass('active');
        $(this).addClass('active');
        let htmlOWL = '';
        imagesList.forEach(image => {
            htmlOWL += ` <div class="item">
            <img class="show-image" class="image-fluid" src="${image}">
        </div>`
        });
        owl6.trigger('replace.owl.carousel', htmlOWL).trigger('refresh.owl.carousel');

        let htmlOwlPreviewImage = '';
        imagePrviewList.forEach(imageUrl => {
            htmlOwlPreviewImage += `<div class="owl-item-content">
            <img src="${imageUrl}">
            </div>`
        });
        owl7.trigger('replace.owl.carousel', htmlOwlPreviewImage).trigger('refresh.owl.carousel');
    });
    $('#btn-video-libary').click(function() {
        $('.image-libary-right-menu li').removeClass('active');
        $(this).addClass('active');

        let htmlOWL = '';
        videoList.forEach(video => {
            htmlOWL += `       <div class="item">
            <iframe src="${video}?enablejsapi=1" width="100%"
                allowfullscreen frameborder="0" height="721px"></iframe>
            </div>`
        });
        owl6.trigger('replace.owl.carousel', htmlOWL).trigger('refresh.owl.carousel');

        let htmlOwlPreviewImage = '';
        videoPreviewImageList.forEach(imageUrl => {
            htmlOwlPreviewImage += `<div class="owl-item-content">
            <img src="${imageUrl}">
            </div>`
        });
        owl7.trigger('replace.owl.carousel', htmlOwlPreviewImage).trigger('refresh.owl.carousel');
    });
}

function owlPositionController() {

}



function owlDevelopmentController() {
    var owl2 = $('#owl-carousel-2');
    // Go to the next item of slider text
    $('.development-item.next-development-item').click(function() {
        owl2.trigger('next.owl.carousel', [500]);
    });

    // Go to the previous item of sliderText
    $('.development-item.prev-development-item').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl2.trigger('prev.owl.carousel', [500]);
    });
}

function ScrollListener() {
    $(window).scroll(function() {
        var scrollPosition = $(window).scrollTop();
        if (window.matchMedia('screen and (min-width: 900px)').matches) {
            var headerHeight = $(".header-background-image").height();
            if ((scrollPosition + 300) > headerHeight) {
                $('body header.container-header').addClass('background-header-fixed-desktop');
                $('.fb-logo img').addClass('scroll');
                $('.phone img').addClass('scroll');
            } else {
                $('body header.container-header').removeClass('background-header-fixed-desktop');
                $("header .nav li a").removeClass('active');


                $('.fb-logo img').removeClass('scroll');
                $('.phone img').removeClass('scroll');
            }
            // $('.container-header .nav li a ').css('color', 'rgb(125, 115, 114)');
            // if (scrollPosition === 0) {
            //     $('.container-header .nav li a ').css('color', 'rgb(244, 238, 231)');
            // } else {
            //     $('.container-header .nav li a ').css('color', 'rgb(125, 115, 114)');
            // }
        } else if (window.matchMedia('screen and (max-width: 768px)').matches) {
            var menuHeight = $('body header.container-header').outerHeight();
            if (scrollPosition > menuHeight) {
                $('body header.container-header').addClass('background-header-fixed');
            } else if (!$('html').hasClass('is-main-menu-open')) {
                $('body header.container-header').removeClass('background-header-fixed');
            }
        }
    });
}