$(document).ready(function() {
    owlApartmentInit();
    owlDevelopmentProjectInit();
    owlDevelopmentController();
    owlNewsInit();
    owlDotsForPositionSlider();

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
        items: 2.5,
        nav: false,
        dots: false,
        autoplay: false,
        center: false,
        margin: 40,
        autoHeight: false,
        loop: true,
    });
    var owl5 = $('#owl-carousel-5');
    // Go to the next item of slider text
    $('.btn-next-position').click(function() {
        owl5.trigger('next.owl.carousel', [500]);
    });

    // Go to the previous item of sliderText
    $('.btn-prev-position').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl5.trigger('prev.owl.carousel', [500]);
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
    var owl3 = $('#owl-carousel-3');
    // Go to the next item of slider text
    $('.inner-news .btn-next-post').click(function() {
        owl3.trigger('next.owl.carousel', [500]);
    });

    // Go to the previous item of sliderText
    $('.inner-news .btn-prev-post').click(function() {
        // With optional speed parameter
        // Parameters has to be in square bracket '[]'
        owl3.trigger('prev.owl.carousel', [500]);
    });
}



function owlLibaryOwlInit() {
    $('#owl-carousel-6').owlCarousel({
        lazyLoad: true,
        items: 1,
        center: false,
        nav: false,
        autoHeight: false,
        dots: false,
        loop: true,
        autoplay: false,
        margin: 10,
        animateIn: 'fadeIn', // add this
        animateOut: 'fadeOut', // and this
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
                autoplay: false

            },
            1020: {

            }
        }
    });
    var owl6 = $('#owl-carousel-6');
    var owl7 = $('#owl-carousel-7');

    owl6.on('changed.owl.carousel', function(e) {
        // console.log("current: ", e.relatedTarget.current())
        // console.log("current: ", e.item.index) //same
        // console.log("total: ", e.item.count) //total
        owl7.trigger('to.owl.carousel', e.item.index + 1)
    });
    // Go to the next item of slider text
    $('.btn-next-libary').click(function() {
        owl6.trigger('next.owl.carousel', [500]);
    });

    // Go to the previous item of sliderText
    $('.btn-prev-libary').click(function() {
        // With optional speed parameter
        owl6.trigger('prev.owl.carousel', [500]);
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