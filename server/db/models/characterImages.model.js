const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class CharacterImage extends Model {
    static get tableName() {
        return tableNames.character_images;
    }
}

module.exports = CharacterImage;