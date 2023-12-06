const multer = require('multer');

const upload = multer({ dest: __basedir + '/images' });

module.exports = upload