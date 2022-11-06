import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class AppService {
  public constructor() {
    const token = process.env.BOT_TOKEN;

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, { polling: true });

    // Matches "/echo [whatever]"
    // bot.onText(/\/echo (.+)/, (msg, match) => {
    //   // 'msg' is the received Message from Telegram
    //   // 'match' is the result of executing the regexp above on the text content
    //   // of the message
    //
    //   const chatId = msg.chat.id;
    //   const resp = match[1]; // the captured "whatever"
    //
    //   // send back the matched "whatever" to the chat
    //   bot.sendMessage(chatId, resp);
    // });

    bot.onText(/\/metadata (.+)/, (msg) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message

      const chatId = msg.chat.id;

      // send back the matched "whatever" to the chat
      console.log(msg);
      bot.sendMessage(chatId, '```' + JSON.stringify(msg) + '```');
    });

    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;

      console.log(msg);

      // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, 'Received your message');
    });
  }

  getHello(): string {
    return 'Hello App!';
  }
}
