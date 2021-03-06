var express = require('express');
var router = express.Router();
const Settings = require('../../models/settingModel');


const formidable = require('formidable');
var path_image = require('path');


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

    router.get('/', isAuthenticated, function(req, res) {
        Settings.findOne({ type: 'introduction' }, function(err, introduction) {
            res.render('admin/pages/introduction/index', { messages: req.flash('messages'), title: "Giới thiệu website", introduction: introduction.toJSON(), layout: 'admin.hbs' });
        });
    });
    router.post('/', isAuthenticated, function(req, res) {
        const form = formidable({ multiples: true });
        form.on('fileBegin', function(name, file) {
            if (file.name !== '' && file.name !== undefined && file.name !== null) {
                file.path = path_image.join(__basedir, `public/img/${name}.png`);
            }
        });
        form.parse(req, (err, fields) => {
            if (err) {
                req.flash('messages', "Update không thành cong !");
            } else {
                Settings.updateOne({ type: 'introduction' }, { content: fields }, function(err, data) {
                    if (!err) {
                        req.flash('messages', 'Update thành công !')
                        res.redirect('back');
                    } else {
                        req.flash('messages', 'Update không thành công công !')
                        res.redirect('back');
                    }
                });
            }
        });
    });

    return router;
}