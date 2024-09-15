// // src/api/upload/upload.route.js
// const express = require('express');
// const multer = require('multer');
// const { uploadFile, downloadFile } = require('./upload.controller');
// const router = express.Router();

// // Configure multer for handling file uploads
// const upload = multer({ dest: 'uploads/' }); // Temporarily store files in 'uploads' directory

// // Route for uploading a file
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded');
//     }
//     // Call the controller function to upload the file to Mega
//     const link = await uploadFile(req.file.path);
//     res.status(200).json({ link });
//   } catch (error) {
//     res.status(500).send('Error uploading file');
//   }
// });

// // Route for downloading a file
// router.post('/download', async (req, res) => {
//   const { fileUrl, destination } = req.body;
//   try {
//     await downloadFile(fileUrl, destination);
//     res.status(200).send('File downloaded successfully');
//   } catch (error) {
//     res.status(500).send('Error downloading file');
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadFileToFirebase } = require('./upload.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory for easier handling

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Check if a file is provided
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const tempDir = path.join(__dirname, 'temp');
        const tempFilePath = path.join(tempDir, req.file.originalname); // Temporary file path

        // Ensure the temp directory exists
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir); // Create the directory if it doesn't exist
        }

        // Write the file buffer to the temp folder
        fs.writeFileSync(tempFilePath, req.file.buffer);

        // Upload the file to Firebase Storage
        const uploadResult = await uploadFileToFirebase(tempFilePath);

        // Remove the temporary file after successful upload
        fs.unlinkSync(tempFilePath);

        // Respond with success and Firebase URLs
        return res.status(200).json({
            message: 'File uploaded successfully',
            downloadUrl: uploadResult.downloadUrl,
            readUrl: uploadResult.readUrl,
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        return res.status(500).json({ error: 'Failed to upload file.' });
    }
});

module.exports = router;




