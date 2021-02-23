/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (activityCropsModel.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

const Model = require('objection').Model;

class ActivityCrops extends Model {
  static get tableName() {
    return 'activityCrops';
  }

  static get idColumn() {
    return 'activity_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['field_crop_id'],

      properties: {
        activity_id: { type: 'integer' },
        field_crop_id: { type: 'integer' },
      },
      additionalProperties: false,
    };
  }
}

module.exports = ActivityCrops;
