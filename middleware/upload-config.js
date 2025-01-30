const multer = require("multer");
const path = require("path");
const fs = require("fs");
module.exports = {
  storage: new multer.diskStorage({
    destination: function (req, file, cb) {
      let ts = Date.now();
      let date_ob = new Date(ts);
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      const dir = "./uploads/image/" + year + "/" + month + "/";
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, (err) => {
          return cb(null, dir);
        });
      } else {
        return cb(null, dir);
      }
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  }),
};
