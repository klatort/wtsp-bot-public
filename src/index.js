const chats = require("./saved/chats.json");
const permissions = require("./saved/permissions.json");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client } = require("whatsapp-web.js");

class WhatsAppBot {
  constructor() {
    this.client = new Client({ puppeteer: { args: ["--no-sandbox"] } });
    this.commands = new Map();
    this.client.on("qr", this.displayQRCode.bind(this));
    this.client.on("ready", this.onClientReady.bind(this));
    this.client.on("message", this.handleMessage.bind(this));
  }

  displayQRCode(qr) {
    qrcode.generate(qr, { small: true });
  }

  async onClientReady() {
    const commandFiles = fs
      .readdirSync("./src/commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      const commandInstance = new command();
      this.commands.set(commandInstance.name, commandInstance);
    }

    console.info(this.commands);
    //Add extra functionality to the bot from here
    console.log("Client is ready!");
  }

  async handleMessage(msg) {
    const chatId = (await msg.getChat()).id.user;
    //Use these lines to get the user who sent the message with the group id
    //const data = await msg.from;
    //console.info(data);
    const isCommand = msg.body.startsWith("!");

    if (isCommand) {
      if (chats.hasOwnProperty(chatId)) {
        try {
          const args = msg.body.slice(1).split(/ +/);
          const command = this.commands.get(args.shift().toLowerCase());
          if (command != undefined) {
            if (
              !args.every((arg) =>
                /^[a-zA-Z0-9áéêíóúüñÁÉÊÍÓÚÜÑ.,;:'"¿?!¡()/\s]+$/.test(arg)
              )
            )
              return msg.reply(
                "Invalid arguments, please use only letters and numbers."
              );
            const hasPermission = permissions[
              chats[chatId].permissions
            ].includes(command.name);
            if (hasPermission) {
              if (command._usesDependency) {
                await command.execute(this.openai, msg, args);
              } else {
                command.execute(msg, args);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  reloadFile(dir) {
    fs.watchFile(dir, (curr, prev) => {
      if (curr.mtime > prev.mtime) {
        console.log("Reloading " + dir + " file...");
        delete require.cache[require.resolve(dir)];
      }
    });
  }

  initialize() {
    this.client.initialize();
    this.reloadFile("./saved/chats.json");
    this.reloadFile("./saved/permissions.json");
  }
}
module.exports = WhatsAppBot;
