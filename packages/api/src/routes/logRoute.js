/* 
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (logRoute.js) is part of LiteFarm.
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

const logController = require('../controllers/logController');
const express = require('express');
const router = express.Router();
const checkScope = require('../middleware/acl/checkScope');
const hasFarmAccess = require('../middleware/acl/hasFarmAccess');

router.post('/', logController.logController.addLog());
router.get('/', hasFarmAccess, checkScope(['get:logs']), logController.logController.getLog());
router.put('/:log_id', hasFarmAccess, checkScope(['edit:logs']), logController.logController.putLog());
router.delete('/:log_id', hasFarmAccess, checkScope(['delete:logs']), logController.logController.deleteLog());

module.exports = router;
