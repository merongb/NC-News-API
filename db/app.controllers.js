const { selectTopics,
        selectArticleById,
        selectArticles,
        selectCommentsByArticleId,
        insertCommentByArticleId,
        selectUsers,
        updateArticleVotesById,
        removeCommentById,
        selectCommentById,
         } = require("./app.models")
const endpoints = require('../endpoints.json')


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({ topics })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getEndpoints = (req, res) => {
   res.status(200).send(endpoints)
}

exports.getArticles = (req, res, next) => {

    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
 
    selectArticleById(article_id).then((article) => {
     res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
 }

 exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    
    selectArticleById(article_id)
    .then((article) => {
        selectCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
    }).catch((err) => {
        next(err)
    })
};

exports.postCommentByArticleId =(req, res, next) => {
    const { article_id } = req.params
    const newComment = req.body

    if (!newComment || typeof newComment.username !== 'string' || typeof newComment.body !== 'string') {
        return res.status(400).send({ message: 'Bad Request' });
    }
    selectArticleById(article_id).then(() => {
    selectUsers(newComment.username).then((users) => {
    if (users.length === 0) {
        return res.status(404).send({ message: 'User Not Found' });
                }
        insertCommentByArticleId(newComment, article_id).then((comment) => {
            res.status(201).send({ comment });
                        }).catch((err) => {
                            next(err);
                        });
                })
        }) .catch((err) => {
            next(err);
        });
 }

 exports.patchArticleVotesById = (req, res, next) => {
    const { article_id } = req.params
    const  {inc_votes}  = req.body

       if (!inc_votes){
        selectArticleById(article_id).then((article) => {
            res.status(200).send({article})
        })
    }   else if (typeof inc_votes !== "number"){
        return res.status(400).send({ message: 'inc_votes must be a number' })
    }   else {

   selectArticleById(article_id).then(() => {
        updateArticleVotesById(article_id, inc_votes).then((article) => {
            res.status(200).send({ article })
        })
    }) .catch((err) => {
        next(err)
    })
}}

exports.deleteCommentById = async (req, res , next) => {
    try {
        const { comment_id } = req.params;
    
        await selectCommentById(comment_id);
        await removeCommentById(comment_id);
    
        res.status(204).send();
      } catch (err) {
        next(err);
      }

}

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({ users })
    }).catch((err) => {
        next(err)
    })
}