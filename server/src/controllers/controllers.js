const { sendHello } = require('../modules/module');

exports.getHello = (req, res, next) => {
  res.status(200).send(sendHello());
};
