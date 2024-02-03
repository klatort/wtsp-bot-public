const fs = require("fs");
const chats = require("../saved/chats.json");
const permissions = require("../saved/permissions.json");

class HelpCommand {
  constructor() {
    this.name = "help";
    this.description = "Ayuda causa";
    this.usage = "";
    this._usesDependency = false;
    this._hidden = true;
  }

  async execute(msg, args) {
    const commands = [];
    const chatId = (await msg.getChat()).id.user;
    const commandFiles = fs
      .readdirSync("./src/commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      const commandInstance = new command();
      commands.push(commandInstance);
    }

    const replyCommands =
      "Los comandos disponibles son: \n" +
      commands
        .map((command) => {
          if (permissions[chats[chatId].permissions].includes(command.name) && command.name != "help") {
            let str = "🔸 " + command.name + ": " + command.description;
            if (command.usage != "") {
              str = str + " - " + command.usage;
            }
            return str + "\n";
          }
        })
        .join();

    msg.reply(replyCommands);
  }
}
module.exports = HelpCommand;
