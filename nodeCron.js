const decompress = require("decompress");
const request = require('superagent');
const fs = require('fs')
const moment = require('moment')
const nodeCron = require("node-cron");


//Download and unzip currency files and save in temporal file
const downloadAndUnzip = async () => {

  let currencies = ["BTCEUR",
    "ADAEUR",
    "AVAXEUR",
    "BCHEUR",
    "BNBEUR",
    "BTTEUR",
    "CHZEUR",
    "DOGEEUR",
  ]

  const date = moment().subtract(1, "days").format('YYYY-MM-DD')

  for (currency of currencies) {

    const href = `https://data.binance.vision/data/spot/daily/klines/${currency}/1m/${currency}-1m-${date}.zip`;
    let zipFile = currency + "_" + 'downloaded.zip';
    let destination = `temp/${currency}-1m-${date}`

    request
      .get(href)
      .on('error', function (error) {
        console.log(error);
      })
      .pipe(fs.createWriteStream(zipFile))
      .on('finish', function () {

        decompress(zipFile, destination)
          .then((files) => {
            console.log(files);

            fs.unlink(zipFile, function (err) {
              if (err) return console.log(err);
              console.log('file deleted successfully');
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });

  }
}


//crone job to be execute the download and unzip every day at 12am
const job = nodeCron.schedule("00 00 12 * * *", function () {
  downloadAndUnzip()
  console.log("job done");
});




