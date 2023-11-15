const models = require('../models/loging/models');
const home = require('../models/home/home');
class Info {
    registration(req, res) {
        return models.registration(req, res);
    }
    authorization(req, res) {
        return models.authorization(req, res);
    }
    getInfo(req, res) {
        return home.getInfo(req, res);
    }
}
module.exports = new Info()