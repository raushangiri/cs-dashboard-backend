// const multer = require('multer');
// const path = require('path');

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // Initialize Multer with storage configuration
// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });

// module.exports = upload;
