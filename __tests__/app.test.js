const app = require ("../db/app")
const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")

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
            body.topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug", expect.any(String))
                expect(topic).toHaveProperty("description", expect.any(String))
            })
        })
    });
});