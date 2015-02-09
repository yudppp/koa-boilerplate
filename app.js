var koa = require('koa'),
    router = require('koa-router'),
    ECT = require('ect'),
    config = require('config'),
    logger = require('koa-logger'),
    favicon = require('koa-favicon'),
    session = require('koa-session'),
    responseTime = require('koa-response-time'),
    bodyParser = require('koa-bodyparser'),
    json = require('koa-json');

var renderer = ECT({ root : __dirname + '/views', ext : '.ect' });
var port = config.port || 3000;
var mode = config.mode || 'dev'
var isDevelop = mode == 'local' || mode == 'dev';

var app = koa();
require('koa-qs')(app)
app.use(responseTime());
app.use(logger());
app.use(bodyParser());
app.keys = ['some secret hurr'];
app.use(session(app));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(json({ pretty: isDevelop, param: 'pretty' }));
if (isDevelop) {
  app.use(require('koa-static')(__dirname + '/test/fixtures'));
}


app.use(router(app));

app.get('/', function *(next) {
  var data = {title: "Hello Koa.js"}
  this.body = renderer.render('index.ect', data);
});

app.get('/status', function *(next) {
  this.body = {status: true};
});

app.listen(port);

console.log('listening on port ' + port);
