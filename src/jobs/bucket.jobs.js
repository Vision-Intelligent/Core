const Queue = require("bull");
const Config = require("../config");
const axios = require("axios").default;
const DataValidation = require("../misc/DataValidation");
const { default: Axios } = require("axios");
const fs = require("fs");
const path = require("path");
const { setQueues } = require("bull-board");

const DOWNLOAD_QUEUE = "DOWNLOAD_QUEUE";
const ZIP_QUEUE = "ZIP_QUEUE";
const UNZIP_QUEUE = "UNZIP_QUEUE";

const downloadQueue = new Queue(DOWNLOAD_QUEUE, {
  redis: {
    host: Config.redisHost,
    port: Config.redisPort,
    password: Config.redisSecret,
  },
});

downloadQueue.process(async function (job, done) {
  const { url, bid, des } = job.data;
  if (!DataValidation.allNotUndefined(url, des)) {
    done(new Error("Url, bucket id and destination directory are required"));
    return;
  }
  const { data, headers } = await Axios({
    url: url,
    method: "GET",
    responseType: "stream",
  });
  const totalLength = headers["content-length"];
  const writer = fs.createWriteStream(path.join(Config.bucketSite, bid, des));
  writer.on("error", (err) => {
    done(err);
  });
  writer.on("close", () => {
    done();
  });
  let current = 0;
  data.on("data", (chuck) => {
    current += chuck.length;
    job.progress((current / totalLength) * 100);
  });
  data.pipe(writer);
});

const zipQueue = new Queue(ZIP_QUEUE, {
  redis: {
    host: Config.redisHost,
    port: Config.redisPort,
    password: Config.redisSecret,
  },
});

const unzipQueue = new Queue(UNZIP_QUEUE, {
  redis: {
    host: Config.redisHost,
    port: Config.redisPort,
    password: Config.redisSecret,
  },
});

setQueues([downloadQueue, zipQueue, unzipQueue]);

module.exports = {
  queue: {
    downloadJob: downloadQueue,
    zip: zipQueue,
    unzip: unzipQueue,
  },
};
