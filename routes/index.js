var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Dashboard Ministerio de Turismo'});
});

router.get('/transporteEstablecimientos', function(req, res, next) {
  res.render('transporteEstablecimientos', {title: 'Dashboard Transporte y Establecimientos'});
});

router.get('/entradaExtranjeros', function(req, res, next) {
  res.render('entradaExtranjeros', {title: 'Dashboard Entrada Extranjeros'});
});

module.exports = router;
