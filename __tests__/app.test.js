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

describe('GET /api/article/:article_id/comments', () => {
    test('returns 200 status code and an array of objects with the following properties', () => {
        return request(app).get("/api/articles/1/comments").expect(200).then(({body}) => {
            expect(body.comments).not.toHaveLength(0)
            body.comments.forEach((comment) => {
                expect(comment).toHaveProperty("comment_id", expect.any(Number));
                expect(comment).toHaveProperty("body", expect.any(String));
                expect(comment).toHaveProperty("article_id", 1);
                expect(comment).toHaveProperty("author", expect.any(String));
                expect(comment).toHaveProperty("votes", expect.any(Number));
                expect(comment).toHaveProperty("created_at", expect.any(String));
            })
        })
    });

    test('returns the comments with the most recent created first', () => {
        return request(app).get("/api/articles/3/comments").expect(200).then(({body}) => {
            expect(body.comments).toBeSortedBy("created_at", {descending : true})
        })
    });
    test('returns an empty array when article_id exists but has no comments', () => {
        return request(app).get("/api/articles/2/comments").expect(200).then(({body}) => {
            expect(body.comments).toEqual([])
        })
    });
    test('returns 400 bad request when given the wrong data type', () => {
        return request(app).get("/api/articles/DROPDATABASE/comments").expect(400)
    });
    test('returns 404 not found when article_id doesnt exist', () => {
        return request(app).get("/api/articles/999/comments").expect(404)
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    test('returns a 201 status code and the posted comment which ignores any other properties', () => {
        const newComment = {
            username: "rogersop",
            body: "This article is very interesting, I wish they explored more about it or perhaps made a tv show",
            age : 23
        }
        return request(app).post(`/api/articles/2/comments`).send(newComment).expect(201).then(({body}) => {
            expect(body.comment).toHaveProperty("body", "This article is very interesting, I wish they explored more about it or perhaps made a tv show");
            expect(body.comment).toHaveProperty("article_id", 2);
            expect(body.comment).toHaveProperty("author", "rogersop");
            expect(body.comment).toHaveProperty("votes", 0)
        })
    });
    test('returns a 404 status code if article id doesnt exist', () => {
        const newComment = {
            username: "rogersop",
            body: "This article is very interesting, I wish they explored more about it or perhaps made a tv show"
        }
        return request(app).post(`/api/articles/999/comments`).send(newComment).expect(404)
    });
    test('returns 400 bad request if body doesnt have correct properties', () => {
        const newComment = {
            height: 200,
            body: "This article is very interesting, I wish they explored more about it or perhaps made a tv show"
        }
        return request(app).post(`/api/articles/2/comments`).send(newComment).expect(400).then(({body}) => {
            expect(body.message).toBe('Bad Request');
        })
    });
    test('returns 400 bad status if id is not a number', () => {
        const newComment = {
            username: "rogersop",
            body: "This article is very interesting, I wish they explored more about it or perhaps made a tv show"
        }
        return request(app).post(`/api/articles/DROPDATABASE/comments`).send(newComment).expect(400)
    });
    test('returns 404 not found if username is not found', () => {
        const newComment = {
            username: "HarryPotter123",
            body: "This article is very interesting, I wish they explored more about it or perhaps made a tv show"
        }
        return request(app).post(`/api/articles/2/comments`).send(newComment).expect(404).then(({body}) => {
            expect(body.message).toBe("User Not Found")
        })
    });
});
describe('PATCH /api/article/:article_id', () => {
    test('returns a 200 status code and the updated article', () => {
        const updatedVotes = {
            inc_votes: 5,
        }
        return request(app).patch("/api/articles/1").send(updatedVotes).expect(200).then(({body}) => {
            expect(body.article).toMatchObject({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 105,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'    
            })
        })
    });
    test('ignores properties that are not inv_votes', () => {
        const updatedVotes = {
            inc_votes: 5,
            DROPDATA: "DROPDATABASE"
        }
        return request(app).patch("/api/articles/1").send(updatedVotes).expect(200).then(({body}) => {
            expect(body.article).toMatchObject({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 105,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'    
            })
        })
    });
    test('returns 200 and the article inc_votes is missing', () => {
        const updatedVotes = {
            DROPDATA: "DROPDATABASE"
        }
        return request(app).patch("/api/articles/1").send(updatedVotes).expect(200).then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'    
        })
        })
    });
    test('returns a 404 status code when article id doesnt exist', () => {
        const updatedVotes = {
            inc_votes: 5,
        }
        return request(app).patch("/api/articles/999").send(updatedVotes).expect(404)
    });
    test('returns a 400 status code when article id is not a number', () => {
        const updatedVotes = {
            inc_votes: 5,
        }
        return request(app).patch("/api/articles/DROPDATABASE").send(updatedVotes).expect(400).then(({body}) => {
            expect(body.message).toBe("Bad Request!");
        })
    });
    test('returns 400 status code when wrong data is passed ', () => {
        const updatedVotes = {
            inc_votes: "DROPDATABASE",
        }
        return request(app).patch("/api/articles/1").send(updatedVotes).expect(400).then(({body}) => {
            expect(body.message).toBe("inc_votes must be a number");
        })

    });
})