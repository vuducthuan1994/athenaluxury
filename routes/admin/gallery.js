var express = require('express');
var router = express.Router();
const Settings = require('../../models/settingModel');

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


module.exports = function() {

    router.get('/', isAuthenticated, function(req, res) {
        Settings.findOne({ type: 'gallery' }, function(err, gallery) {
            if (!err) {
                const success = req.flash('success');
                res.render('admin/pages/gallery/index', { success: success, errors: req.flash('errors'), title: "Hình ảnh dự án", gallery: gallery.toJSON(), layout: 'admin.hbs' });
            }
        });
    });
    router.post('/', function(req, res) {
        const form = formidable({ multiples: true });
        let results = [];
        form.parse(req);
        form.on('fileBegin', function(fieldName, file) {
            var dir = __basedir + '/public/img/maison';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, 0744);
            }
            if (file.name !== '' && fieldName.includes('image')) {
                const fileName = uslug(file.name, { allowedChars: '.-_', lower: true });
                results.push({
                    url: `/img/maison/${fieldName}-${fileName}`,
                    caption: '',
                    type: 'image'
                });
                file.path = path.join(__basedir, `public/img/maison/${fieldName}-${fileName}`);
            }
        });
        form.on('field', (fieldName, fieldValue) => {
            if (fieldName.includes('youtube')) {
                results.push({
                    type: 'youtube',
                    url: fieldValue,
                    options: {
                        width: 853,
                        height: 480,
                        youtube: { autoplay: 0 }
                    }
                });
            }
            if (fieldName.includes('image')) {
                results.push({
                    url: fieldValue,
                    caption: '',
                    type: 'image'
                });
            }
        });

        form.on('end', function() {
            console.log(results);
            Settings.updateOne({ type: 'gallery' }, { content: results }, function(err, data) {

                if (!err) {
                    req.flash('success', 'Update thành công !')
                    res.redirect('back');
                } else {
                    req.flash('errors', 'Update không thành công !')
                    res.redirect('back');
                }
            });

        });
    });

    return router;
}