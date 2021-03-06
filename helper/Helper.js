require('dotenv').config();
var url = require('url');
var uslug = require('uslug');

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

function getProtocol(req) {
    var proto = req.connection.encrypted ? 'https' : 'http';
    // only do this if you trust the proxy
    proto = req.headers['x-forwarded-proto'] || proto;
    return proto.split(/\s*,\s*/)[0];
}

function convertNumber(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
module.exports = {
    buildFullDomain(link) {
        if (link == '#') {
            return 'Chưa upload file !';
        }
        return process.env.DOMAIN + link;
    },
    createSlugFromTitle: function(title, link) {
        var slugFromTitle = uslug(title, { lower: true });
        var id = youtube_parser(link);
        return '/' + process.env.R_VIDEO + '/' + id + '/' + slugFromTitle;
    },
    geEmbbedYotube: function(link) {
        var id = youtube_parser(link);
        return `https://www.youtube.com/embed/${id}`;
    },
    convertNumber: function(num, digits) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },

    convertDescription: function(string) {
        if (string == null || string == '' || string == undefined) {
            return string;
        }
        return string.replace('\n', '<br>');
    },

    fancyTimeFormat(time) {
        // Hours, minutes and seconds
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    },

    buildRoute(id, title) {
        var slugFromTitle = uslug(title);
        const url = '/' + process.env.R_VIDEO + '/' + id + '/' + slugFromTitle;
        return url;
    },
    createShareFbLink(url) {
        const BASE_URL = 'https://www.facebook.com/sharer/sharer.php?u=';
        return BASE_URL + url;
    },
    createTwitterShareLink(url) {
        const BASE_URL = 'https://twitter.com/share?url=';
        return BASE_URL + url;
    },
    buildRouteSearch(text) {
        // console.log(text);
        if (text == null || text == undefined || text == '') {
            return text;
        }
        slug = uslug(text);

        return `/${process.env.R_SEARCH}/${slug}`;
    },

    fullUrlFromRequest(req) {
        return decodeURIComponent(url.format({
            protocol: getProtocol(req),
            host: req.get('host'),
            pathname: req.originalUrl
        }));
    },
    buildRouteDownloadDetail(id, title) {
        var slugFromTitle = uslug(title, { lower: true });
        const url = '/' + process.env.R_DOWNLOAD + '/' + id + '/' + slugFromTitle;
        return url;
    },
    decodeString(str) {
        if (str == null || str == '' || str == undefined) {
            return str;
        }
        return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
    },
    convertStringToNumber(str) {
        if (str == null || str == '' || str == undefined) {
            return 0;
        }
        let view_count = str.replace('views', '').trim();
        view_count = view_count.split(',').join('');
        const result = view_count ? convertNumber(parseInt(view_count), 2) : 0;
        return result;
    },
    createLinkYoutube(videoId) {
        return 'https://www.youtube.com/watch?v=' + videoId;
    },
    checkLength(array) {
        if (array.length <= 0) {
            return true;
        }
        return false
    },
    selected(option, value) {
        if (option && value) {
            return option.toLowerCase() == value.toLowerCase() ? 'selected' : '';
        } else {
            if (option == 'event') {
                return 'selected';
            }
        }
    },
    timeDifference(previous) {
        const current = new Date().getTime();
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
        }
    },
    checkNull(str) {
        if (str == null || str == '' || str == undefined) {
            return 'recently';
        }
        return str;
    },
    getThumbnailImage(thumb_image, banner_image) {
        if (thumb_image) {
            return thumb_image;
        }
        return banner_image;
    },
    formatDate(dt) {
        return (`${
            (dt.getMonth()+1).toString().padStart(2, '0')}/${
            dt.getDate().toString().padStart(2, '0')}/${
            dt.getFullYear().toString().padStart(4, '0')} ${
            dt.getHours().toString().padStart(2, '0')}:${
            dt.getMinutes().toString().padStart(2, '0')}:${
            dt.getSeconds().toString().padStart(2, '0')}`);
    },
    createFieldName(index, data) {
        // console.log(data);
        return data.replace('0', index);
    },
    bytesToSize(bytes) {

        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    checked(currentValue) {
        return currentValue ? 'checked' : '';
    },
    getStatusPost(isPublic) {
        if (isPublic) {
            return 'Đã xuất bản';
        } else {
            return "Nháp";
        }
    },
    buildActionPosts(id) {
        if (id == null || id == undefined) {
            return '/admin/posts';
        } else {
            return (`/admin/posts/edit-post/${id}`)
        }
    },
    buildActionGallery(id, type) {
        if (type == 'image') {
            if (!id) {
                return '/admin/gallery/create/image';
            }
            return (`/admin/gallery/edit/image/${id}`)
        }
        if (type == 'video') {
            if (!id) {
                return '/admin/gallery/create/video';
            }
            return (`/admin/gallery/edit/video/${id}`)
        }
    },
    getDescriptionArtiles(description) {
        var result = description.substring(0, 85) + '...';
        return result;
    },
    getDateArtiles(dt) {
        return `${dt.getDate().toString().padStart(2, '0')} Tháng ${(dt.getMonth()+1).toString().padStart(1, '0')} Năm ${dt.getFullYear().toString().padStart(4, '0')}`
    },
    if_equal: function(a, b, opts) {
        if (a == b) {
            return opts.fn(this)
        } else {
            return opts.inverse(this)
        }
    }
}