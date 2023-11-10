const models = require('../models/models')
class Info {
    read(req, res) {
        return models.read(req, res);
    }
}
module.exports = new Info()