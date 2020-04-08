exports.run = (input, commands, userIsAmin) => {
  const { prefix } = require('../config.json');

  function subCommandPatternMatch(args, subCommand) {
    return args.match(subCommand.argsPattern)
  }

  // Check command actually exists
  const command = commands.get(input.command);
  if (!command) {
    return {
      message: `I don't understand that. See \`${prefix} help\` for more usage information.`
    }
  }

  // Check if command is admin-locked
  if (command.adminLocked && !!!userIsAmin) {
    return {
      message: "You don't have permission to use that command."
    }
  }

  // Check if given sub-command exists
  const subCommand = command.subCommands[input.subCommand];
  if (!subCommand) {
    return {
      message: `I don't recognise that sub-command. See \`${prefix} ${command.name} help\` for usage information.`
    }
  }

  // Check if sub-command matches the expected pattern
  const args = subCommandPatternMatch(input.args, subCommand);
  if (!args) {
    return {
      message: `Here's how you use that \`${prefix} ${subCommand.usage}\`. See \`${prefix} help\` for more usage information.`
    }
  }

  // All good
  return {
    success: true,
    args: args.groups,
    subCommand
  }
}
