var express = require('express');
var router = express.Router();
const Gallery = require('../../models/galleryModel');
const sharp = require('sharp');
var fs = require('fs');
const formidable = require('formidable');
var path = require('path');
var uslug = require('uslug');

var isAuthenticated = function(req, res, next) {
    if (process.env.ENV == 'DEV') {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


router.get('/', isAuthenticated, function(req, res) {
    Gallery.find({}, function(err, gallerys) {
        if (!err) {
            const success = req.flash('success');
            res.render('admin/pages/gallery/index', { success: success, errors: req.flash('errors'), title: "Thư viện ảnh , video", gallerys: gallerys.map(gallery => gallery.toJSON()), layout: 'admin.hbs' });
        }
    });
});

router.get('/add-gallery/:type', isAuthenticated, function(req, res) {
    const type = req.params.type;
    res.render('admin/pages/gallery/add-gallery', { type: type, title: "Thêm ảnh hoặc video", layout: 'admin.hbs' });
});
router.get('/edit-gallery/:id/:type', isAuthenticated, function(req, res) {


    const type = req.params.type;
    const galleryID = req.params.id;
    Gallery.findOne({ _id: galleryID }, function(err, galleryItem) {
        if (err) {
            req.flash('messages', 'Lỗi hệ thống, không sửa được bài viết !')
            res.redirect('back');
        } else {
            res.render('admin/pages/gallery/add-gallery', { type: type, errors: req.flash('errors'), messages: req.flash('messages'), title: "Sửa ", layout: 'admin.hbs', galleryItem: galleryItem.toJSON() });
        }
    })
});

let resizeImage = function(oldPath, newPath, width, height) {
    sharp(oldPath)
        .resize(width, height)
        .toFile(newPath, function(err) {
            if (err) {
                console.log(err);
            }
        });
}
router.post('/create/:type', function(req, res) {
    var dir = __basedir + '/public/img/gallery';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0744);
    }

    let content = {};
    content['type'] = req.params.type;
    const form = formidable({ multiples: true });
    form.parse(req);
    form.on('fileBegin', function(name, file) {
        // if (name == 'url_image' && file.name !== '' && req.params.type == 'image') {
        //     let fileName = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.-', lower: true });
        //     file.path = path.join(__basedir, `public/img/gallery/${fileName}`);
        //     content['url_image'] = `/img/gallery/${fileName}`;
        // }
    });
    form.on('field', function(fieldName, fieldValue) {
        if (fieldName !== 'url_image') {
            content[fieldName] = fieldValue;
        }
    });
    form.on('file', function(fieldName, file) {
        if (fieldName == 'url_image' && file.name !== '') {
            let fileName = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.-', lower: true });
            if (req.params.type == 'image' || req.params.type == 'video') {
                const thumb_image = path.join(__basedir, `public/img/gallery/thumb-${fileName}`);
                content['thumb_image'] = `/img/gallery/thumb-${fileName}`;
                resizeImage(file.path, thumb_image, 374, 210);
            }
        }

        if (name == 'url_image' && file.name !== '' && req.params.type == 'image') {
            let fileName = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.-', lower: true });
            const url_image = path.join(__basedir, `public/img/gallery/${fileName}`);
            content['url_image'] = `/img/gallery/${fileName}`;
            resizeImage(file.path, url_image, 1820, 720);
        }
    });

    form.on('end', function() {

        Gallery.create(content, function(err, galleryItem) {
            console.log(err);
            if (!err) {
                req.flash('messages', 'Tạo thành công !');
                res.redirect('/admin/gallery');
            } else {
                let msg = null;
                if (err.code = 11000) {
                    msg = err.errmsg;
                }
                req.flash('errors', `${msg}`);
                res.redirect('back');
            }
        });
    });
});

router.post('/edit/:type/:id', function(req, res) {
    var dir = __basedir + '/public/img/gallery';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0744);
    }

    const idGallery = req.params.id;
    let content = {};

    const form = formidable({ multiples: true });
    form.parse(req);
    form.on('fileBegin', function(name, file) {
        // if (name == 'url_image' && file.name !== '' && req.params.type == 'image') {
        //     let fileName = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.-', lower: true });
        //     file.path = path.join(__basedir, `public/img/gallery/${fileName}`);
        //     content['url_image'] = `/img/gallery/${fileName}`;
        // }
    });
    form.on('field', function(fieldName, fieldValue) {
        if (fieldName !== 'url_image') {
            content[fieldName] = fieldValue;
        }
    });

    form.on('file', function(fieldName, file) {
        if (fieldName == 'url_image' && file.name !== '') {
            let fileName = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.-', lower: true });
            if (req.params.type == 'image' || req.params.type == 'video') {
                const thumb_image = path.join(__basedir, `public/img/gallery/thumb-${fileName}`);
                content['thumb_image'] = `/img/gallery/thumb-${fileName}`;
                resizeImage(file.path, thumb_image, 374, 210);
            }
        }
        if (name == 'url_image' && file.name !== '' && req.params.type == 'image') {
            let fileName = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.-', lower: true });
            const url_image = path.join(__basedir, `public/img/gallery/${fileName}`);
            content['url_image'] = `/img/gallery/${fileName}`;
            resizeImage(file.path, url_image, 1820, 720);
        }
    });

    form.on('end', function() {


        content['updated_date'] = new Date();
        Gallery.findOneAndUpdate({ _id: idGallery }, content, function(err, post) {
            if (!err) {
                req.flash('messages', 'Sửa thành công !');
                res.redirect('/admin/gallery');
            } else {
                let msg = null;
                if (err.code = 11000) {
                    msg = err.errmsg;
                }
                req.flash('errors', `${msg}`);
                res.redirect('back');
            }
        });
    });
});

router.get('/delete/:id', isAuthenticated, function(req, res) {
    const id = req.params.id;
    const messages = [];
    Gallery.findOneAndDelete({
        _id: id,
    }, function(err, galleryItem) {
        if (galleryItem && galleryItem.thumb_image) {
            filePath = 'public' + galleryItem.thumb_image;
            fs.unlink(filePath, function(err) {

            });
        }
        if (galleryItem && galleryItem.url_image) {
            filePath = 'public' + galleryItem.url_image;
            fs.unlink(filePath, function(err) {

            });
        }
        if (!err) {
            messages.push('Xóa thành công')
            req.flash('messages', messages)
            res.redirect('back');
        } else {
            messages.push('Xóa thất bại ')
            req.flash('messages', messages)
            res.redirect('back');
        }
    });
});


module.exports = router;