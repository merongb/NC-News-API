const db = require("../db/connection")

exports.selectTopics = () => {
return db.query(`
SELECT * FROM topics
`).then(({rows}) => {
    return rows
})
}

exports.selectArticleById = (article_id) => {

    return db.query(`
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.body,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM
      articles
    LEFT JOIN
      comments ON articles.article_id = comments.article_id
    WHERE
      articles.article_id = $1
    GROUP BY
      articles.article_id;
  `, [article_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status : 404, message : 'Article Does Not Exist!'})
        }   else {
            return rows[0]
        }
    })
 }

 exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
    return exports.selectTopics().then((topics) => {
      const validTopics = {};
      topics.forEach((row) => {
        validTopics[row.slug] = row.slug;
      });

      const validSortBys = {
        author: "author",
        title: "title",
        article_id: "article_id",
        topic: "topic",
        body: "body",
        created_at: "created_at",
        votes: "votes",
        article_img_url: "article_img_url",
        comment_count: "comment_count"
      }
  
      let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
          COUNT(comments.article_id) AS comment_count FROM articles
        LEFT JOIN
          comments ON articles.article_id = comments.article_id`;
      const values = [];
  
      if (topic in validTopics) {
        queryStr += ` WHERE articles.topic = $1`;
        values.push(topic);
      } else if (topic !== undefined && !(topic in validTopics)) {
        return Promise.reject({ status: 404, message: "Topic Doesn't Exist!" });
      }
      
      queryStr += ` GROUP BY articles.article_id`
          
        if (sort_by in validSortBys)  {
          queryStr += ` ORDER BY ${sort_by}`
        } else if (sort_by !== undefined && !(sort_by in validSortBys)){
          return Promise.reject({ status: 404, message: "Doesn't Exist!" })
        } 
        if (order === "asc" ){
          queryStr += ` ASC` 
        }   else if (order === "desc"){
          queryStr += ` DESC`
        }   else if (order !== undefined && order !== "ASC" && order !== "DESC"){
          return Promise.reject({ status: 404, message: "Doesn't Exist!" })
        }
           ;
  
      return db.query(queryStr, values).then(({ rows }) => {
        return rows;
      });
    });
  };
  

exports.selectCommentsByArticleId = (article_id) => {
return db.query(`
SELECT * FROM comments
WHERE article_id = $1
ORDER BY created_at DESC
`, [article_id]).then(({rows}) => {
    return rows
})
}

exports.insertCommentByArticleId = (newComment,article_id) => {
    const { username, body } = newComment


return db.query(`
INSERT INTO comments
(author, body, article_id)
VALUES
($1, $2, $3)
RETURNING *
`, [username, body, article_id]).then(({rows}) => {
    return rows[0]
})
} 

exports.selectUsers = () => {
    return db.query(`
    SELECT * FROM users
    `).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status : 404, message : "User Not Found"})
        }
        return rows
    })
    
    }

exports.updateArticleVotesById = (article_id, inc_votes) => {
return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [inc_votes, article_id]).then(({rows}) => {
        return rows[0]
    })
    }

exports.selectCommentById = (comment_id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE comment_id = $1;
    `, [comment_id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status : 404, message : 'Comment does not exist'})
        } else {
            return rows[0]
        }
    })
    }
        
        
exports.removeCommentById = (comment_id) => {
    return exports.selectCommentById(comment_id)
    .then(() => {
        return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1;
        `, [comment_id])
    })
}

exports.selectUserByUsername = (username) => {
  if (typeof username === "number"){
    return Promise.reject({status : 400, message : "Bad Request"})
}

  return db.query(`
  SELECT * FROM users
  WHERE username = $1 
  `, [username]).then(({rows}) => {
    if (rows.length === 0){
      return Promise.reject({status: 404, message : "User Not Found"})
    } else return rows[0]
  })
}

exports.editCommentVotes = (comment_id, inc_votes) => {
  return db.query(`
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  ;`, [inc_votes, comment_id]).then(({rows}) => {
    return rows[0]
  })
}
