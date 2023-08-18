const express = require('express')
const {getSingleQuestion,askNewQuestion,getAllQuestions,editQuestion,deleteQuestion,likeQuestion,undoLikeQuestion} = require('../controllers/question')
const {getAccessToRoute, getQuestionOwnerAccess} = require('../middlewares/auth/auth');
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelpers');
const answer = require('./answer');

//api/questions
const router = express.Router();

router.get('/',getAllQuestions);
router.get('/:id',checkQuestionExist,getSingleQuestion);
router.post('/ask',getAccessToRoute,askNewQuestion);
router.put('/:id/edit',[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],editQuestion);
router.delete('/:id/delete',[getAccessToRoute,checkQuestionExist,getQuestionOwnerAccess],deleteQuestion);
router.get('/:id/like',[getAccessToRoute,checkQuestionExist],likeQuestion);
router.get('/:id/undolike',[getAccessToRoute,checkQuestionExist],undoLikeQuestion)

router.use('/:question_id/answers',checkQuestionExist,answer)

module.exports = router;