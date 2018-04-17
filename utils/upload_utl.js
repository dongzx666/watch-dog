const config = require('../config/index.js')

const multer = require('koa-multer');//加载koa-multer模块
//文件上传
//配置
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/public/images/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    let fileFormat = (file.originalname).split(".");
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
exports.upload = multer({ storage: storage });
