const models = require('../models/loging/models');
const home = require('../models/home/home');
class Info {
    registration(req, res) {
        return models.registration(req, res);
    }
    authorization(req, res) {
        return models.authorization(req, res);
    }
    getChatTable(req, res) {
        return home.getChatTable(req, res);
    }
    addChat(req, res) {
        return home.addChat(req, res);
    }
    getMessage(req, res) {
        return home.getMessage(req, res);
    }
    sendMessage(req, res) {
        return home.sendMessage(req, res);
    }
}
module.exports = new Info()