# Auto Bot Kick [HLDS]
Es una pequeña APP de NodeJS que nos ayuda a auto kickear los bots activos cuando necesitemos, es decir cuando el server se haya llenado y se requiera dar espacio para que entre más personas.

Esta APP sirve para un servidor de [Half-life](https://store.steampowered.com/app/70/HalfLife/?l=spanish) o de [Counter-strike](https://store.steampowered.com/app/10/CounterStrike/?l=spanish), aunque en teoría para cualquier otro que use los [JKBotti](https://github.com/Bots-United/jk_botti).

### Instalación
```js
npm install
// o
yarn
```

### Uso
Primero hay que crear el archivo **.env** con las variables correspondientes, éstas están ejemplarizadas en el archivo **.env.example**, pero paso a detallarlas:

```js
// archivo .env
IP=   <---- el IP de nuestro server, si corremos el app en local sería: 127.0.0.1, sino la IP pública.
PASSWORD=   <--- la RCON password del server.
PORT=   <--- el Puerto que hemos determinado para el server, normalmente es 27015
INTERVAL=   <--- el intervalo de tiempo en segundos que queremos que tenga el checker.
```

Una vez hecha dicha configuración, correr el programa con:
```js
npm run start
// o
yarn start
```

Obtendremos un resultado en la consola así:

```bash
info No hay que votar ningun BOT
info Volviendo a rebizar en 30 segundos...
info Rcon desconectado
info RCON conectado
info No hay que votar ningun BOT
info Volviendo a rebizar en 30 segundos...
info Rcon desconectado
info RCON conectado
info No hay que votar ningun BOT
info Volviendo a rebizar en 30 segundos...
info Rcon desconectado
```

Básicamente es un programa que se conecta por RCON, obtiene información del server y determina si es necesario botar o no un bot, y ese chequeo lo hace cada "X" segundos, les dije que era simple :V