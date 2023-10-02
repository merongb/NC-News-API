const db = require("./connection")

exports.selectTopics = () => {
return db.query(`
SELECT * FROM topics
`).then((result) => {
    return result.rows
})

}


exports.selectArticles = () => {
    return db.query(`
    SELECT
    articles.author,
    articles.title,
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)
  FROM
    articles
  LEFT JOIN
    comments ON articles.article_id = comments.article_id
  GROUP BY
    articles.article_id
  ORDER BY
    articles.created_at DESC;
    `).then(({rows}) => {
        return rows
    })
}