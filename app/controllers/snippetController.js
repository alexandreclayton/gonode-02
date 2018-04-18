const { Snippet } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const snippet = await Snippet.create(req.body);

      req.flash('success', 'Snippet criado com sucesso');

      res.redirect(`/app/categories/${req.body.CategoryId}/snippets/${snippet.id}`);
    } catch (err) {
      next(err);
    }
  },
};
