# Whatsapp Bot 🤖

This is a project I built because I wanted to pass some news vias whatsapp automatically and the meta API didn't let me to do so. This project basically wraps the **whatsapp-web.js** package and gives it some structure, any extra functionality that you might like to put in should go into the **src/commands** folder as a class, just have in mind that it checks for some attributes in the class:
```javascript
class ExampleCommand {
  constructor() {
    this.name = "example";
    this.description = "lorem";
    this.usage = 'some usage';
    this._usesDependency = false;
    this._hidden = false;
  }
  async execute(msg, args) {
    const text = "Hello world!";
    msg.reply(text);
  }
}
module.exports = ExampleCommand;
```
This will add the 
***ExampleCommand*** to the list of available commands, the default indicator to denote a command is a **!** but it can be changed in the **src/index.js file** *(subject to change)*.

## Starting the bot
To start the bot you need to an active whatsapp account so you can use that account as the bot. When you first clone the repo you have to do the classic stuff:
>npm install && node .

After that, in the terminal you will see a qr code, that's the same qr that would be generated in a whatsapp web login, so you just need to scan it with your phone.

## Security
So if you don't what people to spam commands in chats that you don't want the bot running you can add some rules that will be set in the **src/saved** folder, you will see 2 files, a ***chats.json*** file and a ***permissions.json*** file, these two files contain information on what chats you want users to run commands and which commands they are able to run.

```json
//chats.js
{
  "12012345678901234": {
    "name": "chat group",
    "permissions": "group"
  },
  "51999999999": {
    "name": "personal chat",
    "permissions": "personal"
  }
}
//permisions.json
{
    "complete" : ["help"],
    "group" : ["help", "ping", "everyone"],
    "personal" : ["help", "ping"],
    "group-no-spam" : ["help", "ping"]
}
```
As you can see, you can add what commands can excecute a chat with certain permissions, and in the chat settings you can put a name too! There's no limit on what strings can you put into the **chats.json** file, so if you want to have more functions you can add then in there. Also you might noticed that the personal chat is a phone number while the group chat is not, to this day I have found a way to easily detect a group chat id so you will have to console.log some message propperties so you know what's the id of a group chat, but to make the work easier, the chats.json file is hot swapable, so you can try stuff without having to shutdown the bot.
*** Note: The chat id for a personal chat is the regional code (+51 in my case) without the + sign with the phone number. ***