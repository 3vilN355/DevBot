const _ = require('lodash')
const moment = require('moment');
const Settings = require('../models/Settings');
module.exports = (client, {
  message,
  thankedMember
}) => {
  client.log(`newThank`, `A user thanked someone else, handle this somehow lmao`)
}