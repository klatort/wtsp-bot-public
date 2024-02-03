class PingCommand {
    constructor() {
        this.name = "ping";
        this.description = "Pong!";
        this.usage = '';
        this._usesDependency = false;
        this._hidden = false;
    }
    execute(msg, args) {
        msg.reply("pong");
        console.log(args);
    }
}
module.exports = PingCommand;
