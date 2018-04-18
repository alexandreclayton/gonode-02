const { Snippet, Category } = require('../models');

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

  async show(req, res, next) {
    try {
      const { categoryId, id } = req.params;

      const categories = await Category.findAll({
        where: { UserId: req.session.user.id },
        include: Snippet,
      });

      const snippets = await Snippet.findAll({
        where: { CategoryId: categoryId },
      });

      const snippet = await Snippet.findById(id);

      res.render('snippets/show', {
        categoryId,
        categories,
        snippets,
        currentSnippet: snippet,
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const snippet = await Snippet.findById(req.params.id);

      await snippet.update(req.body);

      req.flash('success', 'Snippet atualizado com sucesso');

      res.redirect(`/app/categories/${snippet.CategoryId}/snippets/${snippet.id}`);
    } catch (err) {
      next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const { id } = req.params;

      await Snippet.destroy({ where: { id } });

      req.flash('success', 'Snippet deletado com sucesso');
      res.redirect(`/app/categories/${req.body.CategoryId}`);
    } catch (err) {
      next(err);
    }
  },
};
