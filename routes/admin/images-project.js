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
        Settings.findOne({ type: 'images-project' }, function(err, images) {
            // console.log(images);
            if (!err) {
                const success = req.flash('success');
                res.render('admin/pages/images-project/index', { success: success, errors: req.flash('errors'), title: "Hình ảnh dự án", images: images.toJSON(), layout: 'admin.hbs' });
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
            if (file.name !== '') {
                const fileName = uslug(file.name, { allowedChars: '.-_', lower: true });
                results.push(`/img/maison/${fieldName}-${fileName}`);
                file.path = path.join(__basedir, `public/img/maison/${fieldName}-${fileName}`);
            }
        });
        form.on('field', (fieldName, fieldValue) => {
            results.push(fieldName);
        });

        form.on('end', function() {
            Settings.updateOne({ type: 'images-project' }, { content: results }, function(err, data) {

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