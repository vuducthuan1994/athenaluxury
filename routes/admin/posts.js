var express = require('express');
var router = express.Router();
var glob = require("glob")
const Posts = require('../../models/postsModel');
const fs = require('fs');
const formidable = require('formidable');
var path = require('path');
var uslug = require('uslug');
const sharp = require('sharp');

var isAuthenticated = function(req, res, next) {
    if (process.env.ENV == 'DEV') {
        return next();
    }
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = function() {

    let getDirectories = function(src, callback) {
        glob(src + '/**/*', callback);
    };
    //get all posts
    router.get('/', isAuthenticated, function(req, res) {
        getDirectories('public/img/posts', function(err, res) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log(res);
            }
        });
        Posts.find({}, function(err, posts) {
            if (!err) {
                res.render('admin/pages/posts/index', { errors: req.flash('errors'), messages: req.flash('messages'), title: "Quản lý bài viết", posts: posts.map(post => post.toJSON()), layout: 'admin.hbs' });
            }
        }).sort({ created_date: -1 });;
    });

    router.get('/add-post', isAuthenticated, function(req, res) {
        res.render('admin/pages/posts/add-post', { title: "Thêm bài viết", layout: 'admin.hbs' });
    });

    router.get('/edit-post/:id', isAuthenticated, function(req, res) {
        const postId = req.params.id;
        Posts.findOne({ _id: postId }, function(err, post) {
            if (err) {
                req.flash('messages', 'Lỗi hệ thống, không sửa được bài viết !')
                res.redirect('back');
            } else {
                res.render('admin/pages/posts/add-post', { errors: req.flash('errors'), messages: req.flash('messages'), title: "Sửa bài viết", layout: 'admin.hbs', post: post.toJSON() });
            }
        })
    });

    router.post('/uploadImages', function(req, res) {
        let fileName = null;
        var photos = [],
            form = new formidable.IncomingForm();
        form.multiples = true;
        form.on('fileBegin', function(fieldName, file) {
            var dir = __basedir + '/public/img/posts';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 0744);
            }
            if (file.name !== '') {
                fileName = uslug((Date.now() + '-' + file.name), { allowedChars: '.-_', lower: true });
                file.path = path.join(__basedir, `public/img/posts/${fileName}`);
                photos.push(`/img/posts/${fileName}`);
            }
        });
        form.on('error', function(err) {
            console.log('Error occurred during processing - ' + err);
        });
        form.on('end', function() {
            var result = { fileName: fileName, uploaded: 1, url: photos[0] };
            res.send(JSON.stringify(result));
        });
        form.parse(req, function(err, field) {
            console.log(field);
        });
    });

    router.post('/edit-post/:id', isAuthenticated, function(req, res) {
        const idPost = req.params.id;
        let banner_image = null;
        const form = formidable({ multiples: true });
        form.on('fileBegin', function(name, file) {
            var dir = __basedir + '/public/img/posts/banners';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 0744);
            }
            if (name == 'banner_image' && file.name !== '') {
                banner_image = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.', lower: true });
                file.path = path.join(__basedir, `public/img/posts/banners/${banner_image}`);
            }
        });
        form.on('file', function(fieldName, file) {
            if (fieldName == 'banner_image' && file.name !== '') {
                var dir = __basedir + '/public/img/posts/thumbails';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, 0744);
                }
                const thumb_path = path.join(__basedir, `public/img/posts/thumbails/400x600-${banner_image}`);
                sharp(file.path)
                    .resize(400, 600)
                    .toFile(thumb_path, function(err) {
                        if (!err) {
                            req.flash('messages', 'Image was resize !')
                        }
                    });
            }
        });

        form.parse(req, (err, fields) => {
            console.log(fields);
            if (banner_image !== null) {
                fields.banner_image = `/img/posts/banners/${banner_image}`;
                fields.thumb_image = `/img/posts/thumbails/400x600-${banner_image}`;
            }
            if (req.user) {
                fields.edit_by = req.user;
            }
            if (fields.isPublic) {
                fields.isPublic = true;
            } else {
                fields.isPublic = false;
            }
            if (err) {
                req.flash('errors', "Không sửa được bài viết !");
            } else {
                fields.updated_date = new Date();
                Posts.updateOne({ _id: idPost }, fields, function(err, data) {
                    if (!err) {
                        req.flash('messages', 'Sửa thành công !');
                        res.redirect('back');
                    } else {
                        req.flash('errors', 'Không sửa được bài viết');
                        res.redirect('back');
                    }
                });
            }
        });

    });

    // create post
    router.post('/', isAuthenticated, function(req, res) {
        let banner_image = null;
        const form = formidable({ multiples: true });
        form.on('fileBegin', function(name, file) {
            if (name == 'banner_image' && file.name !== '') {
                var dir = __basedir + '/public/img/posts/banners';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, 0744);
                }
                banner_image = uslug((new Date().getTime() + '-' + file.name), { allowedChars: '.', lower: true });
                file.path = path.join(__basedir, `public/img/posts/banners/${banner_image}`);
            }
        });
        form.on('file', function(fieldName, file) {
            if (fieldName == 'banner_image' && file.name !== '') {
                var dir = __basedir + '/public/img/posts/thumbails';
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, 0744);
                }
                const thumb_path = path.join(__basedir, `public/img/posts/thumbails/400x600-${banner_image}`);
                sharp(file.path)
                    .resize(400, 600).webp({ quality: 100 })
                    .toFile(thumb_path, function(err) {
                        if (!err) {
                            req.flash('messages', 'Image was resize !')
                        }
                    });
            }
        });

        form.parse(req, (err, fields) => {
            console.log(fields);
            if (req.account) {
                fields.user = req.account;
            }
            if (fields.isPublic) {
                fields.isPublic = true;
            } else {
                fields.isPublic = false;
            }
            if (banner_image !== null) {
                fields.banner_image = `/img/posts/banners/${banner_image}`;
                fields.thumb_image = `/img/posts/thumbails/400x600-${banner_image}`;
            }

            if (err) {
                req.flash('messages', "Không thêm được bài viết !");
                res.redirect('back');
            } else {
                Posts.create(fields, function(err, data) {
                    if (!err) {
                        req.flash('messages', 'Thêm thành công !')
                        res.redirect('/admin/posts');

                    } else {
                        req.flash('messages', 'Không thêm được bài viết')
                        res.redirect('back');
                    }
                });
            }
        });
    });

    router.get('/delete/:id', isAuthenticated, function(req, res) {
        const id = req.params.id;
        const messages = [];
        Posts.findOneAndDelete({
            _id: id,
        }, async function(err, post) {
            if (post && post.banner_image) {
                filePath = 'public' + post.banner_image;
                let resultDeleteImage = await deleteImage(filePath);
                messages.push(resultDeleteImage);
            }

            if (!err) {
                messages.push('Xóa bài viết thành công')
                req.flash('messages', messages)
                res.redirect('back');
            } else {
                messages.push('Xóa bài viết thất bại ')
                req.flash('messages', messages)
                res.redirect('back');
            }
        });
    });

    let deleteImage = function(filePath) {
        return new Promise(function(resolve, reject) {
            fs.unlink(filePath, function(err) {
                if (err) {
                    resolve('Không thể xóa ảnh đại điện bài viết !')
                } else {
                    resolve('Ảnh đại diện bài viết đã bị xóa!')
                }
            });
        })
    }
    return router;
}