const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class AnimeImages extends Model {
    static get tableName() {
        return tableNames.anime_images;
    }
}

module.exports = AnimeImages;