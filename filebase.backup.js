const bucket = require("./src/api/upload/firebase");

// async function getTotalFileCount() {

//   let query = { maxResults: 1000 };
//   let totalCount = 0;

//   while (query) {

//     const [files, nextQuery] = await bucket.getFiles(query);

//     totalCount += files.length;

//     console.log("Processed:", totalCount);

//     query = nextQuery;
//   }

//   console.log("✅ Total Files in Bucket:", totalCount);
// }

// getTotalFileCount().catch(console.error);



const fs = require("fs");
const path = require("path");
const pLimit = require("p-limit");


const DOWNLOAD_DIR = "D:\\Raushan\\Personal\\Rohit\\backend\\cs-dashboard-backend\\filebase_bkup";
const limit = pLimit(15); // parallel downloads

async function downloadFile(file) {

  const localPath = path.join(DOWNLOAD_DIR, file.name);

  // create folder structure
  fs.mkdirSync(path.dirname(localPath), { recursive: true });

  await file.download({
    destination: localPath
  });

  console.log("Downloaded:", file.name);
}

async function backupBucket() {

  let query = { maxResults: 1000 };
  let total = 0;

  while (query) {

    const [files, nextQuery] = await bucket.getFiles(query);

    const downloads = files.map(file =>
      limit(() => downloadFile(file))
    );

    await Promise.all(downloads);

    total += files.length;

    console.log(`Backup Progress: ${total} files`);

    query = nextQuery;
  }

  console.log("\n✅ Backup Complete");
}

backupBucket().catch(console.error);