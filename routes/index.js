var express = require('express');
var router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const userController = require('../controllers/user.controller');

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

module.exports = router;
