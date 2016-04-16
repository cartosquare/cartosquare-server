// options
var options = require('./config/settings.js').options;

var statistic = require('./statistic.js');

// log
var log4js = require('log4js');
log4js.configure(__dirname + '/config/log4js.json');
var logger = log4js.getLogger('app');

// REST服务
var restify = require('restify');

var server = restify.createServer();

exports.startServer = function(port, callback) {
    logger.info('listening on port ' + (port ? port : options.port));
    server.listen(port ? port : options.port, callback);
};

exports.stopServer = function(callback) {
    server.close(callback);
};

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());
server.use(restify.fullResponse());

// 返回服务的版本号
var packageJson = require('./package.json');

server.get('/info', function(req, res, next) {
    res.send({
        version: packageJson.version
    });

    next();
});

server.get('/visit', statistic.updateVisitCount);

