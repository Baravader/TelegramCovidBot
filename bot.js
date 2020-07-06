require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const markup = require('telegraf/markup');
const http = require('http');
const COUNTRIES_LIST = require('./constants');

const PORT = process.env.PORT || 3000;

http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hello World!');
    res.end();
  })
  .listen(process.env.PORT || 3000);
console.log(`listener port is ${PORT}`);


const bot = new Telegraf(process.env.TOKEN);
bot.start((ctx) =>
  ctx.reply(
    `
Набери название страны на английском и получишь статистику!
Список стран по команде /help
`,
    markup
      .keyboard([
        ['US', 'Russia'],
        ['Ukraine', 'Kazakhstan'],
      ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};
  try {
    data = await api.getReportsByCountries(ctx.message.text);

    const formatData = `
Страна ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смерти: ${data[0][0].deaths}
Вылечились: ${data[0][0].recovered}
  `;
    ctx.reply(formatData);
    console.log(`Выбрана страна: ${ctx.message.text} время ${new Date()}`);
  } catch (err) {
    console.log(err);
    console.log('Кривое название страны');
    console.log(ctx.message.text);
    ctx.reply('Такой страны нет! Для списка посмотрите /help');
  }
});

// app.listen(process.env.PORT || 3000);
// bot.listen(process.env.PORT || 33500);
bot.launch();
console.log(`Бот успешно запустился в ${new Date()}`);
