import dotenv from "dotenv";
import log from "npmlog";
import Rcon from "rcon";

const config = dotenv.config();
if (config.error) log.error("Missing environment variables");

// Main
const client = new Rcon(
  process.env.IP,
  process.env.PORT,
  process.env.PASSWORD,
  { tcp: false }
);

// Some utils
const getData = (str) => {
  const arr = str.split("\n");
  const players = arr.slice(7, arr.length - 2);
  if (arr[4]) {
    const maxPlayers = Number(arr[4].split(" ")[5].substring(1));

    let bots = [],
      humans = [];
    players.forEach((player) => {
      const name = player.split(" ")[2];
      const realName = name.substring(1, name.length - 1);
      const vault = player.includes("BOT") ? bots : humans;
      vault.push(realName);
    });
    return {
      humans,
      bots,
      maxPlayers,
    };
  }
};

const ifKickABot = (data) => {
  const totalPlayers = data.humans.length + data.bots.length;
  if (totalPlayers === data.maxPlayers) {
    return Boolean(data.bots.length);
  } else {
    return false;
  }
};

const kickABot = (data) => {
  log.info("Votando al BOT: " + firstBot);
  const firstBot = data.bots[0];
  client.send("kick " + firstBot);
};

const check = (str) => {
  const data = getData(str);
  if (!data) return false;

  // checking for add or remove a bot
  if (data.bots.length) {
    if (ifKickABot(data)) {
      kickABot(data);
    } else {
      log.info("No hay que votar ningun BOT");
    }
  }

  // reinit
  setTimeout(() => {
    client.disconnect();
  }, 2000);
  const timeOut = Number(process.env.INTERVAL) * 1000;
  log.info(`Volviendo a rebizar en ${process.env.INTERVAL} segundos...`);
  setTimeout(() => {
    client.connect();
  }, timeOut);
};

// Init
client
  .on("auth", () => {
    log.info("RCON conectado");
    client.send("status");
  })
  .on("response", (str) => {
    check(str);
  })
  .on("error", (err) => {
    log.error(err);
    client.disconnect();
    process.exit();
  })
  .on("end", function () {
    log.info("Rcon desconectado");
  });
client.connect();
