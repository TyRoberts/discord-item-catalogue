module.exports = {
  name: 'search',
  usage: '!cat search [option] [item]',
  description: 'test',
  execute(message, args) {
    const queryFromFlag = require('../cat_modules/query_from_flag');
    const catalogueSearch = require('./../cat_modules/search_catalogue');
    const pluralize = require('pluralize');

    function resultMessage(result) {
      let message = `• **${result.seller}** is selling **${result.item}** for **${result.price}**`;
      if (result.location) message = message + ` at **${result.location}**`;
      return message + "\n";
    }

    function botSearchResults(results) {
      return {
        resultCount: results.length,
        results: results.map(result => resultMessage(result)).join("\n"),
      };
    }

    catalogueSearch.run(args).then((results) => {
      let listing;
      const multiMessage = [];
      let messageCap = `Hi, ${message.author.username}! That ${queryFromFlag.run(args.flag)} search returned ${pluralize('result', results.length, true)} \n\n`;

      results.forEach(result => {
        listing = resultMessage(result);
        if ((messageCap.length + listing.length) <= 2000) {
          messageCap = messageCap + listing;
        } else {
          multiMessage.push(messageCap);
          messageCap = '';
        }
      });

      multiMessage.push(messageCap);

      multiMessage.forEach(messagePart => {
        message.channel.send(messagePart);
      })
    }).catch((err) => console.log(err));
  },

  valid(args) {
    return !!args.primary;
  }
}
