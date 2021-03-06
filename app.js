const createError = require('http-errors');
const express = require('express');
const method_override = require('method-override');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const categoryDao = require('./models/Category');
const chatDao = require('./models/Chat');

const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const uploadsRouter = require('./routes/uploads');

const session = require('./config/session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const app = express();

// socket.io setup
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(method_override('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session.config);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// login check
app.use( (req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user? req.user[0]:{};
  next();
});

// fetch categories
app.use( async (req, res, next) => {
  res.locals.categories = await categoryDao.find();
  next();
});

// routers
app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/uploads', uploadsRouter);

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// socket event handler
const userList = {};
let count = 1;
app.io.on('connection', async (socket) => {
  console.log('user connected: ', socket.id);
  const log = await chatDao.read();
  app.io.to(socket.id).emit('chatLog is loaded', log);

  socket.on('not loggined', () => {
    const nickname = "guest" + count++;
    userList[socket.id] = nickname;
    app.io.to(socket.id).emit('set nickname', nickname);
    app.io.emit('receive userList', Object.values(userList));
  });

  socket.on('loggined', (nickname) => {
    if (Object.values(userList).indexOf(nickname) > -1) {
      const oldSocketId = Object.keys(userList).find(key => userList[key] === nickname);
      app.io.to(oldSocketId).emit('new connection exists');
    }

    userList[socket.id] = nickname;
    app.io.emit('receive userList', Object.values(userList));
  });

  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
    delete userList[socket.id];
    app.io.emit('receive userList', Object.values(userList));
  });

  socket.on('send message', (nickname, text) => {
    chatDao.create(nickname, text);
    const msg = nickname + ': ' + text;
    console.log(msg);
    app.io.emit('receive message', msg);
  });
});

module.exports = app;
