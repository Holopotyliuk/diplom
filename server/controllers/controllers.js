const models = require('../models/models')
class Info {
    registration(req, res) {
        return models.registration(req, res);
    }
    authorization(req, res) {
        return models.authorization(req, res);
    }
}
module.exports = new Info()