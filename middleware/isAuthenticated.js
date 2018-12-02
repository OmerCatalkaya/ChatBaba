
// const isAuthenticated = function (req, res, next) {
//     console.log('----------------' + req.isAuthenticated()) // true
//     if (req.isAuthenticated()) {
//         res.locals.login = req.isAuthenticated();
//         return next();
//     } else {
//         res.render('permissionDenied', {title: 'Permission denied'});
//     }
// };


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  else 
    res.redirect("/");
}

module.exports = isAuthenticated;
