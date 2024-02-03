require('dotenv').config();
const axios = require("axios");
const { MessageMedia } = require("whatsapp-web.js");

class TextToSpeechComand {
  constructor() {
    this.name = "tts";
    this.description = "Texto a voz!";
    this.usage = "tts <text>";
    this._usesDependency = false;
    this._hidden = false;
  }

  async execute(msg, args) {
    if (!args[0]) return msg.reply("Debes escribir algo!");
    console.log(args);
    const text = args.join(" ");
    const encodedParams = new URLSearchParams();
    encodedParams.set("src", text);
    encodedParams.set("hl", "pt-br");
    encodedParams.set("v", "dinis");
    encodedParams.set("r", "0");
    encodedParams.set("c", "mp3");
    encodedParams.set("f", "48khz_16bit_mono");

    const options = {
      method: "POST",
      url: "https://voicerss-text-to-speech.p.rapidapi.com/",
      params: {
        key: process.env.RAPID_API_KEY,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "b444fe337emsh3dbc47d1af9dd97p16fdcajsnc6c163ce0a10",
        "X-RapidAPI-Host": "voicerss-text-to-speech.p.rapidapi.com",
      },
      data: encodedParams,
      responseType: "arraybuffer", // instruct axios to handle response data as binary
    };

    try {
      const response = await axios.request(options);
      const audioBuffer = Buffer.from(response.data);
      const audioMedia = new MessageMedia(
        "audio/mpeg",
        audioBuffer.toString("base64")
      );
      msg.reply(audioMedia);
    } catch (error) {
      console.error(error);
    }
  }
}
module.exports = TextToSpeechComand;
