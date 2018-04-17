const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  signin(req, res) {
    return res.render('auth/signin');
  },

  signup(req, res) {
    return res.render('auth/signup');
  },

  async register(req, res, next) {
    try {
      const { email } = req.body;

      if (await User.findOne({ where: { email } })) {
        req.flash('error', 'E-mail já cadastrado');
        return res.redirect('back');
      }

      const password = await bcrypt.hash(req.body.password, 5);

      await User.create({ ...req.body, password });

      req.flash('success', 'Usuário cadastrado com sucesso');
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  },

  async authenticate(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash('error', 'E-mail/senha incorretos');
        return res.redirect('back');
      }

      if (!await bcrypt.compare(password, user.password)) {
        req.flash('error', 'E-mail/senha incorretos');
        return res.redirect('back');
      }

      req.session.user = user;

      return res.redirect('app/dashboard');
    } catch (err) {
      return next(err);
    }
  },

  logout(req, res, next) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }

        return res.redirect('/');
      });

      return true;
    } catch (err) {
      return next(err);
    }
  },
};
