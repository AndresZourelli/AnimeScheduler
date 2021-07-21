const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class Actor extends Model {
    static get tableName() {
        return tableNames.actors;
    }

    static get relationMappings() {
        const Images = require("./images.model");
        return {
            actor_images: {
                relation: Model.BelongsToOneRelation,
                modelClass: Images,
                join: {
                    from: 'actors.fk_actor_primary_image',
                    to: 'images.image_id'
                }
            }
        }
    }
}

module.exports = Actor;