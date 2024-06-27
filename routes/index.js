var express = require('express');
var router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const userController = require('../controllers/user.controller');
const collectController = require('../controllers/collect.controller');
const documentController = require('../controllers/document.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/info', (req, res) => {
  res.send('Hello World!')
})

router.get('/transaction', transactionController.index);
router.get('/transaction/:id', transactionController.show);
router.post('/transaction', transactionController.store);
router.put('/transaction/:id', transactionController.update);
router.delete('/transaction/:id', transactionController.drop);

router.get('/user', userController.index);
router.get('/user/:id', userController.show);
router.post('/user', userController.store);
router.put('/user/:id', userController.update);
router.delete('/user/:id', userController.drop);

router.get('/document', documentController.index);
router.get('/document/:id', documentController.show);
router.post('/document', documentController.store);
router.put('/document/:id', documentController.update);
router.delete('/document/:id', documentController.drop);

router.get('/collect', collectController.index);

module.exports = router;
