const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


// 配置后台文章列表列表路由
const articleRouter = require('./routes/admin/articles');
const categoryRouter = require('./routes/admin/categories');
const settingRouter = require('./routes/admin/settings');
const userRouter = require('./routes/admin/users');
const courseRouter = require('./routes/admin/courses');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// 使用后台文章列表路由
app.use('/admin/articles', articleRouter);
app.use('/admin/categories', categoryRouter);
app.use('/admin/settings', settingRouter)
app.use('/admin/users', userRouter)
app.use('/admin/courses', courseRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
