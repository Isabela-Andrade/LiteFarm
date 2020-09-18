/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (pesticideRoute.js) is part of LiteFarm.
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

const express = require('express');
const router = express.Router();
const pesticideController = require('../controllers/pesticideController');
const hasFarmAccess = require('../middleware/acl/hasFarmAccess');
const checkScope = require('../middleware/acl/checkScope');

router.get('/farm/:farm_id', hasFarmAccess(), checkScope(['get:pesticides']), pesticideController.getPesticide());
router.post('/', hasFarmAccess(), checkScope(['add:pesticides']), pesticideController.addPesticide());
router.delete('/:pesticide_id', hasFarmAccess(), checkScope(['delete:pesticides']), pesticideController.delPesticide());

module.exports = router;
