/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (farm.test.js) is part of LiteFarm.
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

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chai_assert = chai.assert;    // Using Assert style
const chai_expect = chai.expect;    // Using Expect style
const chai_should = chai.should();  // Using Should style
const server = require('./../src/server');
const dummy = require('./dummy');
const sinon = require('sinon')
const Knex = require('knex')
const environment = 'test';
const config = require('../knexfile')[environment];
const knex = Knex(config);
let checkJwt;
jest.mock('jsdom')
jest.mock('../src/middleware/acl/checkJwt')
const mocks  = require('./mock.factories');

describe('Farm Tests', () => {
  let middleware;
  beforeAll(() => {
    // beforeAll is set before each test
    // global.token is set in testEnvironment.js
    token = global.token;
  });
  let array =[];
  let beforeEachCounter = 1;
  let testCounter = 2;
  let afterEachCounter = 3;
  async function createUser(email, id) {
    let validSignupUser = {
      email: email || 'test123456_signup@usertest.com',
      first_name: 'Test',
      last_name: 'User',
      user_id: id ||'anifasndoasndoasn'
    }
    return await knex('users').insert(validSignupUser).returning('*');
  }

  async function createFarm(user) {
    let farm = {
      farm_name: '',
      address: '',
      grid_points: { lat: 22.33, lng: 33.55 },
    }
    const [createdFarm] = await knex('farm').insert(farm).returning('*');
    await createUserFarm(user, createdFarm.farm_id);
    return createdFarm;
  }

  async function createUserFarm(user, farm, role=1) {
    return await knex('userFarm').insert({ user_id: user, farm_id: farm, role_id: role, consent_version: '3.0', status: 'Active'})
  }

  beforeEach(async () => {
    array.push(beforeEachCounter);
    beforeEachCounter += 4;
    let [newUser] = await createUser();
    middleware = require('../src/middleware/acl/checkJwt');
    middleware.mockImplementation((req, res, next) => {
      req.user = {};
      req.user.sub = '|' + newUser.user_id;

      next()
    });
  })
  const later = async (delay) =>
    new Promise(resolve => setTimeout(resolve, delay));
  afterEach(async () => {
    array.push(afterEachCounter);
    afterEachCounter += 1;
    await later(100);
    await knex.raw(`
    DELETE FROM "userFarm";
    DELETE FROM farm;
    DELETE FROM users ;
    `)
    array.push(afterEachCounter);
    afterEachCounter += 3;
  });
  afterAll(()=>{
    console.log(array);
  })

  describe('Valid and Invalid Inputs', async () => {
    const blankFark = {
      farm_name: '',
      address: '',
      grid_points: {},
      units: null,
      currency: null,
      sandbox: null
    }
    const validFarm = {
      farm_name: 'Test Farm 1',
      address: '1210 Valid Stret',
      grid_points: {
        lat: 22.33,
        lng: 122.33
      }
    }

    test('should return 400 status if blank farm is posted', async (done) => {
      array.push(testCounter);
      testCounter += 4;
      throw new Error('I have failed you, Anakin')
      postFarmRequest(blankFark, async (err, res) => {
        await later(100);
        expect(res.status).toBe(400);
        done()
      })
    });

    test('should return 400 status if only farm name is filled', async (done) => {
      array.push(testCounter);
      testCounter += 4;
      throw new Error('I have failed you, Anakin')
      postFarmRequest({ ...blankFark, farm_name: 'Test Farm' }, async (err, res) => {
        await later(100);
        expect(res.status).toBe(400);
        done();
      })
    });

    test('should return 400 status if name and invalid address are filled', async (done) => {
      array.push(testCounter);
      testCounter += 4;
      throw new Error('I have failed you, Anakin')
      postFarmRequest({
          ...blankFark,
          farm_name: 'Test Farm',
          address: 'ANSOFANSOD',
          grid_points: { lat: 'sa', long: '212' }
        },
        async (err, res) => {
          expect(res.status).toBe(400);
          done();
        })
    });

    test('should successfully create a farm if valid data is provided', async (done) => {
      array.push(testCounter);
      testCounter += 4;
      throw new Error('I have failed you, Anakin')
      postFarmRequest(validFarm, async (err, res) => {
        expect(res.status).toBe(201);
        const farm = res.body;
        expect(farm.units.currency).toBe('USD');
        expect(farm.units.measurement).toBe('metric');
        expect(farm.sandbox_bool).toBe(false);
        done();
      })
    });

    test('should retrieve a recently created farm', (done) => {
      array.push(testCounter);
      testCounter += 4;
      throw new Error('I have failed you, Anakin')
      postFarmRequest(validFarm, (err, res) => {
        expect(res.status).toBe(201);
        const farmId = res.body.farm_id;
        getFarmRequest(farmId, (err, innerRes) => {
          expect(innerRes.status).toBe(200);
          const [receivedFarm] = innerRes.body;
          expect(receivedFarm.farm_id).toBe(farmId);
          done();
        })
      })
    })

    test('should retrieve a recently created farm with units and currency', (done) => {
      array.push(testCounter);
      testCounter += 4;
      postFarmRequest({...validFarm, units: { measurement: 'imperial', currency: 'MXN'}  }, (err, res) => {
        expect(res.status).toBe(201);
        const farmId = res.body.farm_id;
        getFarmRequest(farmId, (err, innerRes) => {
          expect(innerRes.status).toBe(200);
          const [receivedFarm] = innerRes.body;
          expect(receivedFarm.farm_id).toBe(farmId);
          done();
        })
      });
    });

  });

  describe('Updating a Farm', () => {
    test('should fail to patch an address on a created farm', async (done) => {
      array.push(testCounter);
      testCounter += 4;
      throw new Error('I have failed you, Anakin')
      const [user] = await createUser('test@test.com', 'asfnaosfnaod');
      const farm = await createFarm(user.user_id);
      putFarmRequest({ farm_id: farm.farm_id, address: farm.address + '2222' },user.user_id, (err, res) => {
        expect(res.status).toBe(400);
        done();
      });
    });

    test('should succeed to change farm name', async (done) => {
      array.push(testCounter);
      testCounter += 4;
      throw new Error('I have failed you, Anakin');
      const [user] = await createUser('test@test.com', 'asfnaosfnaod');
      const farm = await createFarm(user.user_id);
      putFarmRequest({ farm_id: farm.farm_id, farm_name: 'OtherTestFarm' }, user.user_id, async (err,res) => {
        expect(res.status).toBe(200)
        const [receivedFarm] = res.body;
        expect(receivedFarm.farm_id).toBe(farm.farm_id);
        expect(receivedFarm.farm_name).toBe('OtherTestFarm');
        const [farmQuery] = await knex.select().from('farm').where({farm_id: farm.farm_id});
        expect(farmQuery.farm_name).toBe('OtherTestFarm');
        done();
      })
    })
  });

  describe('Delete a Farm', () => {

    test('should succeed on deleting a farm that I own or manage', async (done) => {
      array.push(testCounter);
      testCounter += 4;
      const [user] = await createUser('test@test.com', 'asfnaosfnaod');
      const farm = await createFarm(user.user_id);
      deleteRequest(farm, user.user_id, async (err,res) => {
        expect(res.status).toBe(200);
        const farmQuery = await knex.select().from('farm').where({farm_id: farm.farm_id});
        expect(farmQuery.length).toBe(0);
        done()
      });
    })

    xtest('should fail to delete a farm if I am not an owner or manager', async (done) => {
      const [user] = await createUser('test@test.com', 'asfnaosfnaod');
      const [worker] = await createUser('test2@test.com', '12114124m12km4n1o');
      const farm = await createFarm(user.user_id);
      await createUserFarm(worker.user_id, farm.farm_id, 3);
      deleteRequest(farm, worker.user_id, async (err,res) => {
        expect(res.status).toBe(403);
        const farmQuery = await knex.select().from('farm').where({farm_id: farm.farm_id});
        expect(farmQuery.length).not.toBe(0);
        done()
      });
    })
  })
});


function postFarmRequest(data, callback) {
  chai.request(server).post('/farm')
    .set('Content-Type', 'application/json')
    .send(data)
    .end(callback)
}

function getFarmRequest(id, callback) {
  chai.request(server).get(`/farm/${id}`)
    .end(callback)
}

function putFarmRequest(data, user, callback) {
  chai.request(server).put(`/farm/${data.farm_id}`)
    .set('farm_id', data.farm_id)
    .set('user_id', user)
    .send(data)
    .end(callback)
}

function deleteRequest(data, user, callback) {
  chai.request(server).delete(`/farm/${data.farm_id}`)
    .set('farm_id', data.farm_id)
    .set('user_id', user)
    .end(callback)

}
