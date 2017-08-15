var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.send('entradaextranjeros'); 
    //res.send('respond with a resource sdgfhsgdhsgfhgsdfgshdgfhgsdhfghdhsdghfghd');
});


module.exports = router;
