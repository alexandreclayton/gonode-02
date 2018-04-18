const express = require('express');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');
const guestMiddleware = require('./middlewares/guest');

const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const categoryController = require('./controllers/categoryController');
const snippetController = require('./controllers/snippetController');

// set locals
routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

/**
 * Auth
 */
routes.get('/', guestMiddleware, authController.signin);
routes.get('/signup', guestMiddleware, authController.signup);
routes.get('/signout', authController.logout);

routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);

/**
 * Dashboard
 */
routes.use('/app', authMiddleware);
routes.get('/app/dashboard', dashboardController.index);

/**
 * Categories
 */
routes.get('/app/categories/:id', categoryController.show);
routes.post('/app/categories/create', categoryController.store);

/**
 * Snippets
 */
routes.get('/app/categories/:categoryId/snippets/:id', snippetController.show);
routes.post('/app/snippets/create', snippetController.store);
routes.put('/app/snippets/update/:id', snippetController.update);
routes.delete('/app/snippets/delete/:id', snippetController.destroy);

// catch 404
routes.use((req, res) => res.render('errors/404'));

// error handler
routes.use((err, req, res, _next) => {
  res.status(err.status || 500);

  return res.render('errors/index', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

module.exports = routes;
