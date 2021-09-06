const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const util = require('util');

const exec = util.promisify(require('child_process').exec);

const knex = require('knex')({
  client: 'pg',
  connection: { 
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  },
  migrations: {
    directory: "src/migrations",
  }
});

const CronJob = require('cron').CronJob;

function bytesToMb (bytes) {
  return (bytes / (1024*1024)).toFixed(2);
}

const job = new CronJob('0 */5 * * * *', async () => {
  console.info(`--- Date: ${new Date().toISOString()}`);

  try {
    const { stdout } = await exec("speedtest -f json-pretty")
    
    const { download: downloadObject, upload: uploadObject, packetLoss, result, server, ping } = JSON.parse(stdout);

    const download = bytesToMb(downloadObject.bytes);
    const upload = bytesToMb(uploadObject.bytes);

    await knex("tests").insert({
      packetLoss,
      download,
      upload,
      url: result.url,
      server: server.name,
      ping: ping.latency,
    });

    
    console.info(` ✔ PING: ${ping.latency} - DOWNLOAD: ${download} - UPLOAD: ${upload}`);
  } catch (error) {
    console.error(" ✖ Test fail", error);
  }

}, null, true, 'America/Sao_Paulo');

console.info("--------------- START-----------------");

console.info("ℹ Running migration");

knex.migrate.latest()
  .then(() => {
    console.info("✔ Migration completed")
    console.info("✔ Job started")
    job.start();
  })
  .catch((e) => console.error("✖ Migration error", e))
