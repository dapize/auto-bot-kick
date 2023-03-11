import dotenv from "dotenv";
import log from "npmlog";
import Rcon from "rcon";
import Gamedig from "gamedig";

const config = dotenv.config();
if (config.error) log.error("Missing environment variables");

// Some utils
const kickTheBot = (name) => {
  return new Promise((resolve, reject) => {
    const client = new Rcon(
      process.env.IP,
      process.env.PORT,
      process.env.PASSWORD,
      { tcp: false }
    );
    client
      .on("auth", () => {
        log.info(`${new Date()} - Kicking the BOT: ${name}`);
        client.send("kick " + name);
        resolve();
      })
      .on("error", (err) => {
        log.error(err);
        log.info(`${new Date()} - Leaving the process`);
        reject();
        client.disconnect();
        process.exit();
      })
      .on("end", function () {
        log.info(`${new Date()} - Rcon disconnected`);
      });
    client.connect();
  });
};

const getData = () => {
  log.info(`${new Date()} - Getting data of the server`);
  Gamedig.query({
    type: "hldm",
    host: process.env.IP,
    port: process.env.PORT,
  })
    .then(({ maxplayers, players, bots }) => {
      log.info(`${new Date()} - Data getted!`);
      (async () => {
        const totalPlayers = players.length + bots.length;
        if (totalPlayers === maxplayers && bots.length) {
          log.info(`${new Date()} - Lets go to kick a BOT`);
          await kickTheBot(bots[0].name);
        } else {
          log.info(`${new Date()} - I have not to kick any bot`);
        }
        log.info(
          `${new Date()} - Checking in ${process.env.INTERVAL} seconds again...`
        );
      })();
    })
    .catch((error) => {
      log.error(`${new Date()}`);
      console.log(error);
    });
};

// Init
getData();
setInterval(() => {
  getData();
}, process.env.INTERVAL * 1000);
