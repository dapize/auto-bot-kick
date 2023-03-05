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
      const firstQuation = player.indexOf('"');
      const secondQuation = player.indexOf('"', firstQuation + 1);
      const name = player.substring(firstQuation + 1, secondQuation);
      const type = player.substring(secondQuation + 1).split(" ")[2];
      const vault = type === "BOT" ? bots : humans;
      vault.push(name);
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
  const firstBot = data.bots[0];
  log.info(`${new Date()} - Votando al BOT: ${firstBot}`);
  client.send("kick " + firstBot);
};

const check = (str) => {
  const data = getData(str);
  if (!data) {
    log.error(`${new Date()} - No se pudo obtener la data`);
    return false;
  }

  log.info(
    `${new Date()} - BOTS: ${data.bots.length} | HUMANS: ${data.humans.length}`
  );

  // checking for add or remove a bot
  if (data.bots.length) {
    log.info(`${new Date()} - BOTS: ${JSON.stringify(data.bots)}`);
    if (ifKickABot(data)) {
      kickABot(data);
    } else {
      log.info(`${new Date()} - No hay que votar ningun BOT.`);
    }
  } else {
    log.info(`${new Date()} - No hay BOTS disponibles`);
  }

  // reinit
  setTimeout(() => {
    client.disconnect();
  }, 2000);
  log.info(
    `${new Date()} - Volviendo a rebizar en ${process.env.INTERVAL} segundos...`
  );
  setTimeout(() => {
    log.info(`${new Date()} - Intentando conectar...`);
    client.connect();
  }, Number(process.env.INTERVAL) * 1000);
};

// Init
client
  .on("auth", () => {
    log.info(`${new Date()} - RCON conectado`);
    client.send("status");
  })
  .on("response", (str) => {
    check(str);
  })
  .on("error", (err) => {
    log.error(err);
    client.disconnect();
    log.info(`${new Date()} - Leaving the process`);
    process.exit();
  })
  .on("end", function () {
    log.info(`${new Date()} - Rcon desconectado`);
  });
client.connect();
