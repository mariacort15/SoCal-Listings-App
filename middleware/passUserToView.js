const passUserToView = (req, res, next) => {
    res.locals.user = req.user || null;
    next();
  };
  
  module.exports = passUserToView;