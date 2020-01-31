module.exports = {
  name: 'search',
  usage: '!cat search [option] [item]',
  execute(message, args) {
    const logger = require('winston');
    const queryFromFlag = require('../cat_modules/query_from_flag');
    const catalogueSearch = require('../cat_modules/search_catalogue');
    const pluralize = require('pluralize');

    function resultMessage(result) {
      return `• **${result.location || result.seller}** is selling **${result.item}** for **${result.price}**` + "\n";
    }

    function detailedResultMessage(result) {
      return `• [**id:** ${result.rowid}, **owner:** ${result.seller}] **${result.location || result.seller}** is selling **${result.item}** for **${result.price}**` + "\n";
    }

    function verbose() {
      return (args.flag && args.flag.includes('v'))
    }

    function botSearchResults(results) {
      return {
        resultCount: results.length,
        results: results.map(result => resultMessage(result)).join("\n"),
      };
    }

    if (args.primary.startsWith('@')) {
      args.flag = 'l'
      args.primary = args.primary.substring(1);
    }

    const sql = `SELECT rowid, * FROM listings
                 WHERE LOWER(${queryFromFlag.run(args.flag)})
                 LIKE LOWER("%${args.primary.replace('*', '')}%")`

    catalogueSearch.run(sql).then((results) => {
      let listing;
      const multiMessage = [];
      let messageCap = `Hi, ${message.author.username}! That ${queryFromFlag.run(args.flag)} search returned ${pluralize('result', results.length, true)} \n\n`;

      results.forEach(result => {
        listing = verbose() ? detailedResultMessage(result) : resultMessage(result);
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
    }).catch((err) => logger.info(err));
  },

  valid(args) {
    return !!args.primary;
  }
}
