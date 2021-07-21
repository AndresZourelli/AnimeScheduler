const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class SourceMaterialType extends Model {
    static get tableName() {
        return tableNames.source_material_types;
    }
}

module.exports = SourceMaterialType;