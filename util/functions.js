const { MessageEmbed } = require('discord.js');
const moment = require('moment')
require('colors')
module.exports = (client) => {
  /*
      Logs to console
  */
  client.log = (type, msg, title) => {
    if (!title) title = "Log";
    else title = title.magenta.bold
    if (!type) type = 'Null'
    if (['err', 'error'].includes(type.toLowerCase())) type = type.bgRed.white.bold

    console.log(`[${moment().format('D/M/Y HH:mm:ss.SSS').bold.blue}] [${type.green}] [${title.yellow}] ${msg}`);
  };

  client.errEmb = (errnum = 0, extra) => {
    switch(errnum){
      case 0: return new MessageEmbed({color:'RED', description: `${extra?`${extra}`:'Unknown error'}`})
      case 1: return new MessageEmbed({color:'RED', description: `Not given enough arguments${extra?`\n${extra}`:''}`})
      case 2: return new MessageEmbed({color:'RED', description: `Argument invalid${extra?`\n${extra}`:''}`})
    }
  }
  
  client.permlevel = (message, member) => {
    let permlvl = 0;

    let log = message.author.id == '405109496143282187'
    if (client.appInfo && message) message.client.appInfo = client.appInfo
    else if (client.appInfo && member) member.client.appInfo = client.appInfo
    else return -1;

    if (member) member.settings = client.settings.get(member.guild.id)

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if ((message || member).guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message, member)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  /*
   */
  client.randomColor = (s = 0.5, v = 0.95) => {
    var h = (Math.random() + 0.618033988749895) % 1
    var h_i = Math.floor(h * 6)
    var f = h * 6 - h_i
    var p = v * (1 - s)
    var q = v * (1 - f * s)
    var t = v * (1 - (1 - f) * s)
    var r, g, b;
    if (h_i < 2) {
      b = p
      if (h_i == 0) {
        r = v
        g = t
      } else {
        r = q
        g = v
      }
    } else if (h_i < 4) {
      r = p
      if (h_i == 2) {
        g = v
        b = t
      } else {
        g = q
        b = v
      }
    } else {
      g = p
      if (h_i == 4) {
        r = t
        b = v
      } else {
        r = v
        b = q
      }
    }
    return [Math.floor(r * 256), Math.floor(g * 256), Math.floor(b * 256)]
  }

  client.generateGradient = (start_color, end_color, steps = 10) => {
    // strip the leading # if it's there
    start_color = start_color.replace(/^\s*#|\s*$/g, '');
    end_color = end_color.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (start_color.length == 3) {
      start_color = start_color.replace(/(.)/g, '$1$1');
    }
    if (end_color.length == 3) {
      end_color = end_color.replace(/(.)/g, '$1$1');
    }

    // get colors
    var start_red = parseInt(start_color.substr(0, 2), 16),
      start_green = parseInt(start_color.substr(2, 2), 16),
      start_blue = parseInt(start_color.substr(4, 2), 16);

    var end_red = parseInt(end_color.substr(0, 2), 16),
      end_green = parseInt(end_color.substr(2, 2), 16),
      end_blue = parseInt(end_color.substr(4, 2), 16);

    // calculate new color
    var diff_red = end_red - start_red;
    var diff_green = end_green - start_green;
    var diff_blue = end_blue - start_blue;

    let p = 1 / (steps - 1)
    let diff = [`#${start_color}`]
    for (let i = 0; i < steps - 1; i++) {
      let d = [((diff_red * p * (i + 1)) + start_red).toString(16).split('.')[0],
        ((diff_green * p * (i + 1)) + start_green).toString(16).split('.')[0],
        ((diff_blue * p * (i + 1)) + start_blue).toString(16).split('.')[0]
      ]
      diff.push(`#${d.map(v => `${v.length > 1?`${v}`:'0'+v}`).join('')}`)
    }

    return diff
  };

  /*
      COMMAND LOAD AND UNLOAD
  */
  client.loadCommand = (category, commandName, dontLog) => {
    try {
      const props = require(`${process.cwd()}/src/commands/${category}/${commandName}`);
      if (!dontLog) client.log("Load", `Loading Command: ${props.help.name}.`);
      if (props.init) {
        props.init(client);
      }
      if (category) props.help.category = category
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return {
        res: true
      };
    } catch (e) {
      console.log(e)
      return {
        err: `Unable to load command ${commandName} in ${category}: ${e}`
      };
    }
  };

  client.unloadCommand = async (commandName) => {
    const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
    if (!command) return {
      err: `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`
    };
    if (command.shutdown) {
      await command.shutdown(client);
    }
    command.conf.aliases.forEach(alias => {
      client.aliases.delete(alias);
    });
    client.commands.delete(command.help.name);
    delete require.cache[require.resolve(`${process.cwd()}/src/commands/${command.help.category}/${command.help.name}.js`)];
    return {
      res: [command.help.category, command.help.name]
    };
  };
  // Async foreach, allowing us to await for every async iteration to finish
  client.asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };

  client.embColor = 'ea05ec'
  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    // Always best practice to let the code crash on uncaught exceptions.
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};