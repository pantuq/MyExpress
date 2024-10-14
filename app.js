const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const adminAuth = require('./middlewares/admin-auth')
require('dotenv').config()

// 前台数据路由
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');

// 配置后台文章列表列表路由
const articleRouter = require('./routes/admin/articles');
const categoryRouter = require('./routes/admin/categories');
const settingRouter = require('./routes/admin/settings');
const userRouter = require('./routes/admin/users');
const courseRouter = require('./routes/admin/courses');
const chapterRouter = require('./routes/admin/chapters');
const chartRouter = require('./routes/admin/chart');
const authRouter = require('./routes/admin/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 使用前台数据路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);


// 使用后台文章列表路由
app.use('/admin/articles',adminAuth, articleRouter);
app.use('/admin/categories',adminAuth, categoryRouter);
app.use('/admin/settings',adminAuth, settingRouter)
app.use('/admin/users',adminAuth, userRouter)
app.use('/admin/courses',adminAuth, courseRouter)
app.use('/admin/chapters',adminAuth, chapterRouter)
app.use('/admin/charts',adminAuth, chartRouter)
app.use('/admin/auth', authRouter)    //不需要加上中间件，不能还没有登录就要验证登录

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
