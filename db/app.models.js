const db = require("./connection")

exports.selectTopics = () => {
return db.query(`
SELECT * FROM topics;
`).then((result) => {
    return result.rows
})

}

exports.selectArticleById = (article_id) => {

    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
    `, [article_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status : 404, message : 'Article Does Not Exist!'})
        }   else {
            return rows[0]
        }
    })
 }