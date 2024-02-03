class EveryOneCommand {
  constructor() {
    this.name = "everyone";
    this.description = "Menciona a todos los usuarios del grupo";
    this.usage = '';
    this._usesDependency = false;
    this._hidden = false;
  }
  async execute(msg, args) {
    const chat = await msg.getChat();

    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      mentions.push(`${participant.id.user}@c.us`);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  }
}
module.exports = EveryOneCommand;
