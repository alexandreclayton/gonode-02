const { Category, Snippet } = require('../models');

module.exports = {
  async index(req, res, next) {
    try {
      const categories = await Category.findAll({
        where: { UserId: req.session.user.id },
        include: Snippet,
      });

      res.render('dashboard/index', { categories });
    } catch (err) {
      next(err);
    }
  },
};
