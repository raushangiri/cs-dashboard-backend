const multer = require("multer");
const fs = require("fs");
const { error } = require("console");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let userID = req.query.userid;
    let filePath = `./public/${userID}`;
    fs.mkdirSync(filePath, { recursive: true });
    // mkdirp.sync(path, { opts: { mode: 0755 } } );
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const fileType = file.mimetype.split("/")[1];
    const internalUserID = req.query.userid;
    const filename = `${
      file.fieldname
    }-${internalUserID}-${Date.now()}.${fileType}`;
    // if (fileType === "pdf") {
    // console.log(filename);
    cb(null, filename);
    // } else {
    //     cb(new Error("Not a PDF File!!"), false);
    // }
  },
  //limits: { fieldSize: 25 * 1024 * 1024 }
});

const upload = multer({ storage: storage });
// console.log(upload,"up")

// const uploads = multer({ storage: storage });
// console.log(uploads)
module.exports = { upload };
