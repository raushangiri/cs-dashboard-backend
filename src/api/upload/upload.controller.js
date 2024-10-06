// // src/api/upload/upload.controller.js
// const mega = require('mega');
// const path = require('path');
// const fs = require('fs');

// // Mega credentials
// const MEGA_EMAIL = 'raushangiri.raj@gmail.com'; // Replace with your Mega email
// const MEGA_PASSWORD = 'Test@1234'; // Replace with your Mega password

// // Initialize Mega client
// const client = mega({ email: MEGA_EMAIL, password: MEGA_PASSWORD });

// // Function to upload a file to Mega
// async function uploadFile(filePath) {
//   return new Promise((resolve, reject) => {
//     client.upload(filePath, (err, link) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve(link);
//     });
//   });
// }

// // Function to download a file from Mega
// async function downloadFile(fileUrl, destination) {
//   return new Promise((resolve, reject) => {
//     client.download(fileUrl, destination, (err) => {
//       if (err) {
//         return reject(err);
//       }
//       resolve('Download completed');
//     });
//   });
// }

// module.exports = { uploadFile, downloadFile };
// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');
// const path = require('path');

// // Firebase Storage settings
// const STORAGE_BUCKET = 'jbj-fintech.appspot.com';
// const API_KEY = 'AIzaSyCiTdQAQXJjX3Hoxs4mdjb4Y55q_ajXPp4';

// async function uploadFileToFirebase(filePath) {
//   const fileName = path.basename(filePath);
//   const fileStream = fs.createReadStream(filePath);
//   const form = new FormData();
//   form.append('file', fileStream, fileName);

//   const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o?uploadType=multipart&name=${encodeURIComponent(fileName)}`;

//   try {
//     const response = await axios.post(uploadUrl, form, {
//       headers: {
//         ...form.getHeaders(),
//         'Authorization': `Bearer ${API_KEY}`,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     throw new Error(`Error uploading file to Firebase Storage: ${error.response ? error.response.data : error.message}`);
//   }
// }

// module.exports = {
//   uploadFileToFirebase,
// };
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');
const client = new ftp.Client();
client.ftp.verbose = true; // Enable verbose mode to get more details
client.ftp.timeout = 30000; // Increase timeout to 30 seconds

// Firebase Storage Configuration
const STORAGE_BUCKET = 'jbj-fintech.appspot.com';
const API_KEY = 'AIzaSyCiTdQAQXJjX3Hoxs4mdjb4Y55q_ajXPp4';

async function uploadFileToFirebase(filePath) {
    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);
    const form = new FormData();
    form.append('file', fileStream, fileName);

    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o?uploadType=multipart&name=${encodeURIComponent(fileName)}`;

    try {
        // Upload the file to Firebase Storage
        const response = await axios.post(uploadUrl, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${API_KEY}`, // Replace with the correct Firebase auth token if needed
            },
        });

        // Construct URLs for download and read
        const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(fileName)}?alt=media`;
        const readUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(fileName)}?alt=media&token=${response.data.downloadTokens}`;

        return {
            downloadUrl,
            readUrl,
        };
    } catch (error) {
        console.error('Error uploading file to Firebase:', error.response ? error.response.data : error.message);
        throw new Error('Failed to upload file to Firebase.');
    }
}

const uploadFile = async (req, res) => {
    const client = new ftp.Client();
    client.ftp.timeout = 30000;
    try {
        // Connect to the FTP server
        await client.access({
          host: '100.212.213.251',
          user: 'Server',
          password: 'jbj@0007',
          secure: false, // Set to true if using FTPS
        });
      
        console.log("Connected to the FTP server");
      
        // Ensure that the 'test' directory exists
        await client.ensureDir('/remote/path/test');
        console.log('Folder "test" created or already exists');
      
        // Upload the file to the 'test' directory
        await client.uploadFrom('./loan_image.jpg', 'test/loan_image.jpg');
        console.log('File uploaded successfully to the "test" folder');
      
      } catch (err) {
        console.error('Error:', err);
      } finally {
        client.close();
      }
    };
  

    async function deleteFileFromFirebase(documentUrl) {
        try {
            // Extract the file name from the documentUrl
            const fileName = documentUrl.split('/o/')[1].split('?')[0]; // Extract the portion after '/o/' and before the query params
            const encodedFileName = encodeURIComponent(fileName); // Encode the file name to handle spaces and special characters
    
            // const deleteUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodedFileName}`;
            const deleteUrl = `${documentUrl}`;

            // Perform the DELETE request
            const response = await axios.delete(deleteUrl, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`, // Make sure you have a valid OAuth token
                },
            });
    
            if (response.status === 204 || response.status === 200) {
                console.log('File deleted successfully from Firebase.');
            } else {
                console.log('Failed to delete file from Firebase.');
            }
        } catch (error) {
            console.error('Error deleting file from Firebase:', error.response ? error.response.data : error.message);
            throw new Error('Failed to delete file from Firebase.');
        }
    }

  const deleteFileFromFtp = async (filePath) => {
    console.log("api called")
    const client = new ftp.Client();
    client.ftp.timeout = 30000;
    try {
        await client.access({
            host: '100.212.213.251',
            user: 'Server',
            password: 'jbj@0007',
            secure: false,
        });

        console.log('Connected to the FTP server');
        await client.remove(filePath); // Provide the relative path of the file to delete
        console.log(`File ${filePath} deleted successfully from the FTP server`);
    } catch (err) {
        console.error('Error deleting file from FTP:', err);
        throw new Error('Failed to delete file from FTP.');
    } finally {
        client.close();
    }
};

  



module.exports = {
  uploadFileToFirebase,
  uploadFile,
  deleteFileFromFirebase,
  deleteFileFromFtp,
};
