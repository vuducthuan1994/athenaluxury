let express = require('express');
let router = express.Router();
let fs = require('fs');
var path = require('path');
const Settings = require('../models/settingModel');
const Posts = require('../models/postsModel');
const Gallerys = require('../models/galleryModel');
const Subscribe = require('../models/subscribeModel');
const helper = require('../helper/Helper');
require('dotenv').config();
const util = require('../helper/Helper');

// sitemap import lib
const { SitemapStream, streamToPromise } = require('sitemap')
const { createGzip } = require('zlib')
let sitemap;

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: process.env.CACHE_TIME });

const EmailService = require('../service/email_service');
const emailHelper = new EmailService();

const rateLimit = require("express-rate-limit");
const commonLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hours
    max: 200 // limit each IP to 100 requests per windowMs
});

router.use(function(req, res, next) {
    next();
});

router.post('/api/register-visit', commonLimiter, function(req, res) {
    if (req.body.name && req.body.email && req.body.phone) {
        Subscribe.create(req.body, function(err, data) {
            if (!err) {
                res.json({
                    success: true,
                    data: data,
                    msg: 'Chúc mừng bạn đã đăng ký thành công'
                });
                const mailOptions = {
                    from: process.env.EMAIL_ACCOUNT, // sender address
                    to: process.env.EMAIL_SHOP, // list of receivers
                    subject: `AthenaLuxury - NHẬN ĐƯỢC ĐĂNG KÝ XEM NHÀ MẪU TỪ KHÁCH HÀNG ${data.name}`, // Subject line
                    html: `<h5>TÊN KHÁCH HÀNG: ${data.name}</h5>   <h5>Email khách hàng: ${data.email}</h5> <br>  <p> <strong>Số điện thoại Khách hàng:</strong> ${data.phone} </p>` // plain text body
                };
                emailHelper.sendEmail(mailOptions);
            } else {
                const msg = err.code = 11000 ? 'Thông tin này đã được đăng ký' : 'Lỗi hệ thống, vui lòng thử lại sau';
                res.json({
                    success: false,
                    msg: msg,
                    data: err
                });
            }
        });
    } else {
        res.json({
            success: false,
            msg: 'Truyền thiếu tham số !'
        })
    }

});
router.get('/api/getPostsByType/:type', function(req, res) {
    const postType = req.params.type;
    Posts.find({ type: postType }, function(err, posts) {
        if (!err) {
            res.status(200).json({ success: true, posts: posts });
        }
    })
})

router.get('/api/getGalleryByType/:type', function(req, res) {
    const galleryType = req.params.type;
    Gallerys.find({ type: galleryType }, function(err, gallerys) {
        if (!err) {
            res.status(200).json({ success: true, gallerys: gallerys });
        }
    }).sort({ idx: -1 })
})

router.get('/api/posts/:id', function(req, res) {
    const postId = req.params.id;
    Posts.findOne({ _id: postId }, function(err, post) {
        if (!err) {
            res.status(200).json({ success: true, post: post, created_date: helper.getDateArtiles(post.created_date) });
        }
    })
});
router.get('/api/gallery', function(req, res) {
    Settings.findOne({ type: 'gallery' }, function(err, gallery) {
        if (!err) {
            res.status(200).json({ success: true, gallery: gallery });
        } else {
            res.status(200).json({ success: false, gallery: null });
        }
    });
});
// Trang chu
router.get('/', async function(req, res) {
    let config = cache.get("config");
    if (config == undefined) {
        config = await getConfig();
        cache.set("config", config);
    }

    // let introduction = cache.get("introduction");
    // if (introduction == undefined) {
    //     introduction = await getIntroduction();
    //     cache.set("introduction", introduction);
    // }

    let posts = cache.get("posts");
    if (posts == undefined) {
        posts = await getPosts();
        cache.set("posts", posts);
    }

    // let textSliders = cache.get("textSliders");
    // if (textSliders == undefined) {
    //     textSliders = await getTextSliders();
    //     cache.set("textSliders", textSliders);
    // }

    // let projects = cache.get("projects");
    // if (projects == undefined) {
    //     projects = await getProjects();
    //     cache.set("projects", projects);
    // }

    let images_gallerys = cache.get("images_gallerys");
    if (images_gallerys == undefined) {
        images_gallerys = await getImagesGallerys();
        cache.set("images_gallerys", images_gallerys);
    }

    res.render('client/index', {
        // projects: projects,
        host: req.get('host'),
        posts: posts.map(post => post.toJSON()),
        images_gallerys: images_gallerys.map(image => image.toJSON()),
        // textSliders: textSliders,
        // introduction: introduction,
        // images_project: images_project,
        config: config,
        layout: 'layout.hbs'
    });
});

let getConfig = function() {
    return new Promise(function(resolve, reject) {
        Settings.findOne({ type: 'config' }, function(err, config) {
            if (!err) {
                resolve(config.content);
            }
        });
    });
}

let getProjects = function() {
    return new Promise(function(resolve, reject) {
        Settings.findOne({ type: 'projects' }, function(err, projects) {
            if (!err) {
                resolve(projects.content);
            }
        });
    });
}

let getPosts = function() {
    return new Promise(function(resolve, reject) {
        Posts.find({ isPublic: true, type: 'trending' }, function(err, posts) {
            if (!err) {
                resolve(posts);
            }
        }).sort({ created_date: -1 });
    });
}
let getImagesGallerys = function() {
    return new Promise(function(resolve, reject) {
        Gallerys.find({ type: 'image' }, function(err, images) {
            if (!err) {
                resolve(images);
            }
        }).sort({ idx: -1 });
    });
}



let getIntroduction = function() {
    return new Promise(function(resolve, reject) {
        Settings.findOne({ type: 'introduction' }, function(err, introduction) {
            if (!err) {
                resolve(introduction.content);
            }
        });
    });
}

let getTextSliders = function() {
    return new Promise(function(resolve, reject) {
        Settings.findOne({ type: 'text-sliders' }, function(err, text_sliders) {
            if (!err) {
                resolve(text_sliders.content);
            }
        });
    });
}



// sitemap
router.get('/sitemap.xml', async function(req, res) {
    res.header("Content-Type", "application/xml; charset=utf-8");

    res.header('Content-Encoding', 'gzip');
    // if we have a cached entry send it
    if (sitemap) {
        res.send(sitemap)
        return
    }
    try {
        const BASE_URL = `${req.protocol}://${req.get('host')}`;
        const smStream = new SitemapStream({ hostname: BASE_URL })
        const pipeline = smStream.pipe(createGzip())

        // pipe your entries or directly write them.
        smStream.write({ url: BASE_URL, changefreq: 'daily', priority: 1, img: BASE_URL + '/img/homepage.png' })


        for (let i = 0; i < req.config.top_music.length; i++) {
            const link = util.buildRouteSearch(req.config.top_music[i]);
            smStream.write({ url: link, changefreq: 'always', priority: 0.9 }, 'ASCII')
        }
        for (let i = 0; i < req.config.top_itunes.length; i++) {
            const link = util.buildRouteSearch(req.config.top_itunes[i].name);
            smStream.write({ url: link, changefreq: 'always', priority: 0.8 }, 'ASCII')
        }
        let songs = await getAllSongs();
        for (let i = 0; i < songs.length; i++) {
            const link = util.buildRouteSearch(songs[i].name);
            smStream.write({ url: link, changefreq: 'always', priority: 0.8 }, 'ASCII')
        }
        smStream.end()

        // cache the response
        streamToPromise(pipeline).then(sm => sitemap = sm)
            // stream write the response
        pipeline.pipe(res).on('error', (e) => { throw e })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }
});


module.exports = router;