var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', (req, res, next) => {

  console.log(req.user);
  res.render('chat', { user: req.user });
  
});

module.exports = router;
