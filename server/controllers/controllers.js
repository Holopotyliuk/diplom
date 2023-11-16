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
}
module.exports = new Info()