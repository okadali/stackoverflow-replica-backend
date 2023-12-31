const express = require('express')
const {getSingleQuestion,askNewQuestion,getAllQuestions,editQuestion,deleteQuestion,likeQuestion,undoLikeQuestion} = require('../controllers/question')
const {getAccessToRoute, getQuestionOwnerAccess} = require('../middlewares/auth/auth');
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelpers');
const answer = require('./answer');
const Question = require('../models/Question');

//api/questions
const router = express.Router();


const questionQueryMiddleware = require('../middlewares/query/questionQueryMiddleware');
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware');
router.get('/',questionQueryMiddleware(Question,{
  population: {
    path: "user",
    select: "name profile_image"
  }
}),getAllQuestions);
router.get('/:id',checkQuestionExist,answerQueryMiddleware(Question,{
  population: [
    {
      path: "user",
      select: "name profile_image"
    },
    {
      path: "answers",
      select: "content"
    }
  ]
}),getSingleQuestion);
router.post('/ask',getAccessToRoute,askNewQuestion);
router.put('/:id/edit',[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion);
router.delete('/:id/delete',[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion);
router.get('/:id/like',[getAccessToRoute,checkQuestionExist],likeQuestion);
router.get('/:id/undolike',[getAccessToRoute,checkQuestionExist],undoLikeQuestion)

router.use('/:question_id/answers',checkQuestionExist,answer)

module.exports = router;