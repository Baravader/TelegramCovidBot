require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

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
bot.launch();
console.log(`Бот успешно запустился в ${new Date()}`);
