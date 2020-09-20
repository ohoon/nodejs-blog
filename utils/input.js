module.exports = {
  checkLogIn: (req, res, next) => {
      if (!req.body.username) {
        req.flash('inputErrors', { username: 'error' });
        res.redirect('/login');
      }
      if (!req.body.password) {
        req.flash('username', req.body.username);
        req.flash('inputErrors', { password: 'error' });
        res.redirect('/login');
      }
      
      next();
  },
  checkSignUp: async (req, res, next) => {
      const users = await userDao.findByUsername(req.body.username);
  
      if (req.body.username.length < 5 || req.body.username.length > 20) {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { username: 'Username should be 5-20 words.' });
        return res.redirect('/users/signup');
      }
      if (req.body.password.length < 8 || req.body.password.length > 40) {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { password: 'Password should be 8-40 words.' });
        return res.redirect('/users/signup');
      }
      if (req.body.password !== req.body.confirm_password) {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { confirm_password: 'Password and Confirm Password should be same.' });
        return res.redirect('/users/signup');
      }
      if (!req.body.nickname) {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { nickname: 'Nickname is required.' });
        return res.redirect('/users/signup');
      }
      if (await users.length > 0) {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { username: 'Username already exists.' });
        return res.redirect('/users/signup');
      }

      next();
  },
  checkCreatePost: (req, res, next) => {
      if (!req.body.title) {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { title: 'Title is required.' });
        return res.redirect('/posts/new');
      }
      if (req.body.category_id === 'none') {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { category: 'Please select a valid category.' });
        return res.redirect('/posts/new');
      }
      
      next();
  },
  checkEditPost: (req, res, next) => {
      if (!req.body.title) {
        req.flash('inputDatas', req.body);
        req.flash('inputErrors', { title: 'Title is required.' });
        return res.redirect(`/posts/${req.params.postId}/edit`);
      }

      next();
  },
  checkCreateComment: (req, res, next) => {
    if (!req.body.content) {
      req.flash('inputErrors', { comment: 'error', parent: req.body.parent_comment_id });
      return res.redirect(`/posts/${req.query.postId}`);
    }
    
    next();
  },
}