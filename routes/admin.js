const express = require('express');
let router = express.Router();




var isAuthenticated = function(req, res, next) {
    if (process.env.ENV == 'DEV') {
        return next();
    }
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}



const settings = require('./admin/settings')();
const user = require('./admin/users')();
const posts = require('./admin/posts')();
const introduction = require('./admin/introduction')();
const text_sliders = require('./admin/text-sliders')();
const projects = require('./admin/project')();
const imagesProject = require('./admin/images-project')();
const gallery = require('./admin/gallery');
router.use('/settings', settings);
// router.use('/hosts', host);
router.use('/users', user);
router.use('/introduction', introduction);
router.use('/text-sliders', text_sliders);
router.use('/projects', projects);
router.use('/posts', posts);

router.use('/images-project', imagesProject);
router.use('/gallery', gallery);
router.get('/', isAuthenticated, function(req, res) {
    res.redirect('/admin/posts');
});
module.exports = router;