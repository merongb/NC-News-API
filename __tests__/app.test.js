const app = require ("../db/app")
const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const { getEndpoints } = require("../db/app.controllers")
const endpoints = require("../endpoints.json")

beforeEach(() => {
    return seed(testData)
})
afterAll(() => {
    return db.end()
})
describe('GET /api/topics', () => {
    test('should return a 200 status code', () => {
        return request(app).get("/api/topics").expect(200)
    });
    test('an array of topic objects, each of which should have the properties slug and description', () => {
        return request(app).get("/api/topics").expect(200).then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug", expect.any(String))
                expect(topic).toHaveProperty("description", expect.any(String))
            })
        })
    });
    test('return a 404 error when given a wrong path ', () => {
        return request(app).get("/api/banana").expect(404)
    });
});

describe('GET /api', () => {
    test('returns a 200 status code', () => {
        return request(app).get("/api").expect(200)
    });
    test('returns a json object matching of all the endpoints.json file', () => {
        return request(app).get("/api").expect(200).then(({body}) => {
            expect(body).toEqual(endpoints)
            expect(body).to
        })
    });
    test('returns a 404 status code when given a bad api request', () => {
        return request(app).get("/invalid").expect(404)
    });
});