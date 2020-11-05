// $(window).load(function() {
//     // PAGE IS FULLY LOADED  
//     // FADE OUT YOUR OVERLAYING DIV
//     $(".section-loader").fadeOut();
//     debugger;
// });
$(document).ready(function() {
    // $(".section-loader").delay(3000).fadeOut(500);
    initMenuMobile();
    owlApartmentInit();
    owlDevelopmentProjectInit();
    owlNewsInit();
    owlDotsForPositionSlider();

    ScrollListener();
    owlLibaryOwlInit();
    activeRoute();
    initAnimationForAllSection();
    initListButtonMenuLibary();
    modalController();
    registerVisitExampleHouse();
});
$(window).on('load', function() {
    $('.section-loader').delay(1800).fadeOut(500);
});

function initListButtonMenuLibary() {
    if (window.matchMedia('screen and (max-width: 500px)').matches) {
        $('#list-button-menu-libary').owlCarousel({
            lazyLoad: false,
            margin: 25,
            items: 2.3,
            center: true,
            nav: false,
            dots: true,
            loop: true,
            autoplay: false
        });
    }
}

function registerVisitExampleHouse() {
    $('#button-register').on('click', function(event) {
        var formStatus = $('#form-register').validate({
            errorClass: "text-danger",
            rules: {
                name: "required",
                phone: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: {
                    required: "Vui lòng nhập tên của bạn"
                },
                phone: {
                    required: "Vui lòng điền SĐT của bạn"
                },
                email: {
                    required: "Vui lòng điền email của bạn",
                    email: "Vui lòng nhập đúng định dạng Email"
                }
            }
        }).form();
        if (formStatus) {
            var registerData = $('#form-register').serializeArray();
            $.ajax({
                url: "/api/register-visit",
                data: registerData,
                dataType: "json",
                method: 'POST',
                success: function(res) {
                    if (res.success) {
                        $('#text-result').addClass('text-success');

                        $('#text-result').text(res.msg)
                    } else {
                        $('#text-result').text(res.msg)
                        $('#text-result').addClass('text-warning');

                    }
                    $('#text-result').show();
                    // if (data.success) {
                    //     toast('Thông báo', 'Cám ơn bạn đã review sản phẩm này !', 'success');
                    //     $('.main-thumb-desc li').removeClass('active');
                    //     $('.main-thumb-desc a[href="#detail"]').tab('show');
                    // }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $('#text-result').text('Lỗi hệ thống');
                    $('#text-result').addClass('text-warning');
                }
            });
        }
    });
}

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
        items: 1,
        center: false,
        nav: false,
        autoHeight: true,
        dots: false,
        loop: true,
        autoplay: true,
        margin: 0,
        responsive: {
            0: { margin: 0 },
            768: {
                margin: 0
            },
            1020: {
                margin: 0
            }
        }
    });
    var owl2 = $('#owl-carousel-2');
    $('.development-item.next-development-item').click(function() {
        owl2.trigger('next.owl.carousel', [500]);
    });

    $('.development-item.prev-development-item').click(function() {
        owl2.trigger('prev.owl.carousel', [500]);
    });

    owl2.on('changed.owl.carousel', function(e) {
        // console.log(e.item.index);
        if (e.item.index % 2 == 0) {
            $('#header-project-development').html('<strong>Chủ Đầu Tư </strong>Dự Án');
        }
        if (e.item.index % 2 !== 0) {

            $('#header-project-development').html('<strong>Tư Vấn </strong>Thiết Kế');

        }
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
        lazyLoad: true,
        responsive: {
            0: {
                autoplay: false,
                items: 1,
                margin: 0
            },
            768: {
                items: 1.764,
                margin: 40,
                autoHeight: true
            },
            1020: {}
        }
    });
    var owl5 = $('#owl-carousel-5');
    if (window.matchMedia('screen and (max-width: 500px)').matches) {
        $('#inner-owl-5-controller').owlCarousel({
            lazyLoad: false,
            margin: 15,
            items: 6,
            center: true,
            nav: false,
            dots: true,
            loop: true,
            autoplay: false,
            afterMove: function(elem) {
                console.log(elem);
            }
        });
        var owl5Controller = $('#inner-owl-5-controller');
        $('#inner-owl-5-controller').on('click', '.owl-item', function(e) {
            // e.preventDefault();
            // $('.owl-controller-item').removeClass('active');
            // $(this).find('.owl-controller-item:first').addClass('active-focus');

            // $(property.target).find(".owl-item .owl-controller-item").addClass('focus-active');

            if (window.matchMedia('screen and (min-width: 201px)').matches) {
                owl5Controller.trigger('to.owl.carousel', $(this).index());
                owl5.trigger('to.owl.carousel', $(this).index());
            }
        });
        $('#inner-owl-5-controller .owl-item').eq(6).addClass('active-focus');
        owl5Controller.on('translate.owl.carousel', function(e) {
            idx = e.item.index;
            $('#inner-owl-5-controller .owl-item.active-focus').removeClass('active-focus');
            $('#inner-owl-5-controller .owl-item').eq(idx).addClass('active-focus');

        });
        owl5.on('changed.owl.carousel', function(e) {
            owl5Controller.trigger('to.owl.carousel', e.item.index + 3);
        });
    }

    $('.btn-next-position').click(function() {
        owl5.trigger('next.owl.carousel', [700]);
    });

    $('.btn-prev-position').click(function() {
        owl5.trigger('prev.owl.carousel', [700]);
    });



}

function modalController() {
    $('.modal-wrapper .overlay').click(function() {
        $('.modal-wrapper ').toggleClass('open');
        $('.modal-wrapper .overlay').toggleClass('open');
        $('.modal-wrapper .modal').toggleClass('open');
        $('html').removeClass('is-main-menu-open');
    });
    $('.modal-close.close-button').click(function() {
        $('.modal-wrapper ').toggleClass('open');
        $('.modal-wrapper .overlay').toggleClass('open');
        $('.modal-wrapper .modal').toggleClass('open');
        $('html').removeClass('is-main-menu-open');
    })
    $('.news-content .post-item').click(function() {
        $('html').addClass('is-main-menu-open');
        var id = $(this).data("id");
        getDataArticle(id);

    });
}

function getDataArticle(id) {
    $('#preloader').show();
    $.ajax({
        type: "GET",
        url: "/api/posts/" + id,
        dataType: "json",
        success: function(data) {
            $('#preloader').delay(300).hide();
            const post = data.post;
            const created_date = data.created_date;
            $("#article-image").attr('src', post.banner_image);
            $("#article-public-date").text(created_date)
            $("#article-title").text(post.title)
            $("#short-desc").text(post.short_desc)

            $("#article-content").html(post.body)
            $('.modal-wrapper ').toggleClass('open');
            $('.modal-wrapper .overlay').toggleClass('open');
            $('.modal-wrapper .modal').toggleClass('open');
        }
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
            // 500: {
            //     items: 1.39,
            //     margin: 20,
            //     center: true,
            //     autoHeight: true
            // },
            768: {
                items: 2,
                margin: 40,
                autoHeight: true
            },
            1020: {
                items: 3
            }

        }
    });
    let owl3 = $('#owl-carousel-3');
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
    $('.news-header-right-menu li').click(function() {
        $('#preloader').show();
        const type = $(this).data('type');
        let currentMenu = $(this);
        $.ajax({
            type: "GET",
            url: "/api/getPostsByType/" + type,
            dataType: "json",
            success: function(res) {
                $('#preloader').delay(300).hide();
                if (res.success) {
                    let htmlOWL = '';
                    res.posts.forEach(post => {
                        const short_desc = post.short_desc.substring(0, 85) + '...';
                        htmlOWL +=
                            `  <div data-id="${post._id}" class="post-item">
                        <img src="${post.thumb_image}">
                        <div class="preview">
                            <h3>${post.title}</h3>
                          <p>${short_desc}</p>
                        </div>
                    </div>`
                    });
                    if (htmlOWL) {
                        owl3.trigger('replace.owl.carousel', htmlOWL).trigger('refresh.owl.carousel');
                        $('.news-header-right-menu li').removeClass('active');
                        currentMenu.addClass('active');
                        $('.news-content .post-item').click(function() {
                            $('html').addClass('is-main-menu-open');
                            var id = $(this).data("id");
                            getDataArticle(id);

                        });
                    }
                }
            }
        });
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
                items: 2,

                margin: 10
            },
            768: {
                items: 2,

                margin: 20

            },
            1020: {

            }
        }
    });
    var owl6 = $('#owl-carousel-6');
    var owl7 = $('#owl-carousel-7');

    $('#owl-carousel-7').on('click', '.owl-item', function(e) {

        if (window.matchMedia('screen and (min-width: 801px)').matches) {
            owl7.trigger('to.owl.carousel', $(this).index() - 1);
            owl6.trigger('to.owl.carousel', $(this).index() + 1);
        }
        if (window.matchMedia('screen and (min-width: 201px)').matches) {
            owl7.trigger('to.owl.carousel', $(this).index() + 1);
            owl6.trigger('to.owl.carousel', $(this).index() + 2);
        }

    });
    // $(document).on('click', '.owl-item-content>img', function() {
    //     console.log($(this).data('position'));
    //     console.log($(this).index());
    //     owl7.trigger('to.owl.carousel', $(this).data('position'));
    // });

    owl6.on('changed.owl.carousel', function(e) {
        if (window.matchMedia('screen and (min-width: 801px)').matches) {
            owl7.trigger('to.owl.carousel', e.item.index + 1);
        }
        if (window.matchMedia('screen and (min-width: 201px)').matches) {
            owl7.trigger('to.owl.carousel', e.item.index + 2);
        }

    });

    $('.btn-next-libary').click(function() {
        owl6.trigger('next.owl.carousel', [700]);
    });
    $('.btn-prev-libary').click(function() {
        owl6.trigger('prev.owl.carousel', [700]);
    });

    const videoList = ['https://www.youtube.com/embed/Bc2663p7AHg', 'https://www.youtube.com/embed/hIEIGDsbKqY', 'https://www.youtube.com/embed/tx1A8g6DcbY'];
    const videoPreviewImageList = ['https://tourduthuyenhalong.vn/wp-content/uploads/2019/05/athena-cruise-luxury.jpg', 'https://www.adventureindochina.com/files/thumb/758/508//uploads//Cruises/Athena-cruise/Signature-Mandarin-Cruise_19.jpg', 'https://funnytravelvietnam.com/files/thumb/758/508//uploads//Halong-bay-Cruises/Athena-Lux/athena_cruise_bath_room.jpg'];

    $('#btn-image-libary').click(function() {
        let currentMenu = $(this);
        $('#preloader').show();
        const type = 'image';
        $.ajax({
            type: "GET",
            url: "/api/getGalleryByType/" + type,
            dataType: "json",
            success: function(res) {
                $('#preloader').delay(300).hide();
                if (res.success) {
                    if (res.gallerys.length > 0) {
                        let htmlOWL = '';
                        let htmlOwlPreviewImage = '';
                        res.gallerys.forEach(item => {
                            htmlOWL += ` <div class="item">
                            <img class="show-image" class="image-fluid" src="${item.url_image}">
                        </div>`

                            htmlOwlPreviewImage += `<div class="owl-item-content">
                        <img src="${item.thumb_image}">
                        </div>`
                        });
                        owl6.trigger('replace.owl.carousel', htmlOWL).trigger('refresh.owl.carousel');
                        owl7.trigger('replace.owl.carousel', htmlOwlPreviewImage).trigger('refresh.owl.carousel');
                        $('.image-libary-right-menu li').removeClass('active');
                        currentMenu.addClass('active');
                    }
                }
            }
        });
    });

    _getVideoIdFromUrl = function(value) {
        var regEx = "^(?:https?:)?//[^/]*(?:youtube(?:-nocookie)?\.com|youtu\.be).*[=/]([-\\w]{11})(?:\\?|=|&|$)";
        var matches = value.match(regEx);
        if (matches) {
            return matches[1];
        }
        return false;
    }
    $('#btn-video-libary').click(function() {

        $('#preloader').show();
        const type = 'video';
        let currentMenu = $(this);
        $.ajax({
            type: "GET",
            url: "/api/getGalleryByType/" + type,
            dataType: "json",
            success: function(res) {

                $('#preloader').delay(300).hide();
                if (res.success) {
                    if (res.gallerys.length > 0) {
                        let htmlOWL = '';
                        let htmlOwlPreviewImage = '';
                        res.gallerys.forEach(videoItem => {
                            const idYoutube = _getVideoIdFromUrl(videoItem.url_video);
                            if (idYoutube) {
                                htmlOWL += `       <div class="item">
                                <iframe src="https://www.youtube.com/embed/${idYoutube}?enablejsapi=1" width="100%"
                                    allowfullscreen frameborder="0" ></iframe>
                                </div>`;
                            }

                            htmlOwlPreviewImage += `<div class="owl-item-content">
                            <img src="${videoItem.thumb_image}">
                            </div>`
                        });
                        owl6.trigger('replace.owl.carousel', htmlOWL).trigger('refresh.owl.carousel');

                        owl7.trigger('replace.owl.carousel', htmlOwlPreviewImage).trigger('refresh.owl.carousel');
                        $('.image-libary-right-menu li').removeClass('active');
                        currentMenu.addClass('active');
                    }
                }
            }
        });
    });
}


function ScrollListener() {
    $(window).scroll(function() {
        var scrollPosition = $(window).scrollTop();
        if (window.matchMedia('screen and (min-width: 900px)').matches) {
            if (scrollPosition > 0) {
                $('body header.container-header').addClass('background-header-fixed-desktop');
                $('.fb-logo img').addClass('scroll');
                $('.phone img').addClass('scroll');
            } else {
                $('body header.container-header').removeClass('background-header-fixed-desktop');
                $("header .nav li a").removeClass('active');

                $('.fb-logo img').removeClass('scroll');
                $('.phone img').removeClass('scroll');
            }
        } else if (window.matchMedia('screen and (max-width: 800px)').matches) {
            var menuHeight = $('body header.container-header').outerHeight();
            if (scrollPosition > menuHeight) {
                $('body header.container-header').addClass('background-header-fixed');
            } else if (!$('html').hasClass('is-main-menu-open')) {
                $('body header.container-header').removeClass('background-header-fixed');
            }
        }
    });
}