const { Model } = require('objection');
const tableNames = require('../../utils/constants/tableNames');

class StaffImage extends Model {
    static get tableName() {
        return tableNames.staff_images;
    }
}

module.exports = StaffImage;