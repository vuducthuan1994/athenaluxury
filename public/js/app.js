$(document).ready(function() {
    owlApartmentInit();
    owlDevelopmentProjectInit();
    owlDevelopmentController();
    owlNewsInit();
    owlPositionInit();
    owlPositionController();
    owlDotsForPositionSlider();
    owlImageLibaryInit();
    owlLibaryController();
    ScrollListener();
    owlLibaryOwlInit();
    activeRoute();
});

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
    $('.owl-dot').click(function() {
        const _idx = $(this).index();
        $('#owl-carousel-1').trigger('to.owl.carousel', [_idx, 500]);
        $(`.apartment-left h2`).removeClass("active");
        $(`.apartment-left .typical-grounds-${_idx+1}  h2`).addClass("active");
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

function owlDotsForPositionSlider() {
    $('#owl-carousel-5').owlCarousel({
        lazyLoad: true,
        items: 2.5,
        nav: false,
        dots: false,
        autoHeight: true,
        autoplay: false,
        center: false,
        margin: 40,
        dots: false
    });
}

function owlPositionInit() {
    $('#owl-carousel-4').owlCarousel({
        lazyLoad: true,
        items: 1,
        nav: false,
        dots: false,
        loop: false,
        autoplay: false,
        center: false,
        nav: false,
        margin: 10,
        animateIn: 'fadeIn', // add this
        animateOut: 'fadeOut', // and this
    });
}

function owlImageLibaryInit() {
    $('#owl-carousel-6').owlCarousel({
        lazyLoad: true,
        items: 1,
        nav: false,
        dots: false,
        loop: false,
        autoplay: false,
        center: false,
        autoHeight: false,
        margin: 10,
        animateIn: 'fadeIn', // add this
        animateOut: 'fadeOut', // and this
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
        lazyLoad: true
    });
}

function owlLibaryOwlInit() {
    $('#owl-carousel-7').owlCarousel({
        items: 3,
        center: false,
        nav: true,
        autoHeight: true,
        dots: false,
        loop: true,
        autoplay: true,
        margin: 40,
        lazyLoad: true
    });
}

function owlPositionController() {
    var owl2 = $('#owl-carousel-4');
    // Go to the next item of slider text
    $('.btn-next-position').click(function() {
        owl2.trigger('next.owl.carousel', [500]);
    });

    // Go to the previous item of sliderText
    $('.btn-prev-position').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl2.trigger('prev.owl.carousel', [500]);
    });
}

function owlLibaryController() {
    var owl2 = $('#owl-carousel-6');
    // Go to the next item of slider text
    $('.btn-next-libary').click(function() {
        owl2.trigger('next.owl.carousel', [500]);
    });

    // Go to the previous item of sliderText
    $('.btn-prev-libary').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl2.trigger('prev.owl.carousel', [500]);
    });
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