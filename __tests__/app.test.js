const app = require ("../db/app")
const request = require("supertest")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json")
const jestSorted = require("jest-sorted")

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
        })
    });
});


describe('GET /api/articles/:article_id', () => {
    test('returns a 200 status code', () => {
        return request(app).get("/api/articles/1").expect(200)
    });
    test('returns an article by the id with the following properties', () => {
        return request(app).get("/api/articles/1").expect(200).then(({body}) => {
           expect(body.article).toHaveProperty("author", expect.any(String));
           expect(body.article).toHaveProperty("title", expect.any(String));
           expect(body.article).toHaveProperty("article_id", 1);
           expect(body.article).toHaveProperty("body", expect.any(String));
           expect(body.article).toHaveProperty("topic", expect.any(String));
           expect(body.article).toHaveProperty("created_at", expect.any(String));
           expect(body.article).toHaveProperty("votes", expect.any(Number));
           expect(body.article).toHaveProperty("article_img_url", expect.any(String));
        })
    });
    test('returns 404 error when id number doesnt exist with a message', () => {
        return request(app).get("/api/articles/9999").expect(404).then(({body}) => {
            expect(body.message).toBe("Article Does Not Exist!")
        })
    });
    test('returns a 400 bad request when given an invalid data type', () => {
        return request(app).get("/api/articles/DROPDATABASE").expect(400).then(({body}) => {
            expect(body.message).toBe("Bad Request!")
        })
    });
});

describe('GET /api/articles', () => {
    test('returns a 200 status code', () => {
        return request(app).get("/api/articles").expect(200)  
    });
    test('returns an array of articles which have the following properties', () => {
        return request(app).get("/api/articles").expect(200).then(({body}) => {
            expect(body.articles[0]).toHaveProperty("author", expect.any(String))
            expect(body.articles[0]).toHaveProperty("title", expect.any(String))
            expect(body.articles[0]).toHaveProperty("article_id", expect.any(Number))
            expect(body.articles[0]).toHaveProperty("topic", expect.any(String))
            expect(body.articles[0]).toHaveProperty("created_at", expect.any(String))
            expect(body.articles[0]).toHaveProperty("votes", expect.any(Number))
            expect(body.articles[0]).toHaveProperty("article_img_url", expect.any(String))
            expect(body.articles[0]).toHaveProperty("comment_count", expect.any(String))
        })
    });
    test('returns the articles in descending date order and removes the body property', () => {
        return request(app).get("/api/articles").expect(200).then(({body})=> {
            expect(body.articles).toBeSortedBy("created_at", {descending : true})
            expect(body.articles[0]).not.toHaveProperty("body")

        })
    });
});