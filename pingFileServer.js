const SMB2 = require('smb2');

// Replace with your actual SMB connection details
const smbClient = new SMB2({
  share: '192.168.1.101\share-folder', // IP address and shared folder path of the file server
  username: 'Server', // Your file server username
  password: 'Pass_ jbj@0007', // Your file server password
});

smbClient.readdir('', (err, files) => {
  if (err) {
    console.error('Unable to connect to file server:', err.message);
  } else {
    console.log('Connected successfully. Files in shared folder:', files);
  }
});
