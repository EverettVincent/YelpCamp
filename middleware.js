// middleware.js

const isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        // if not loggedin, store url they are requesting before redirecting back to login
        // console.log(req.path,req.originalUrl);
        
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }

    next();
}

export { isLoggedIn, storeReturnTo }