const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// session middleware (MANDATORY)
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// JWT authentication middleware (MANDATORY)
app.use("/customer/auth/*", function (req, res, next) {
    if (
        req.session.authorization &&
        req.session.authorization.accessToken
    ) {
        jwt.verify(
            req.session.authorization.accessToken,
            "access",
            (err, user) => {
                if (!err) {
                    req.user = user;
                    next();
                } else {
                    return res.status(403).json({ message: "User not authenticated" });
                }
            }
        );
    } else {
        return res.status(403).json({ message: "User not authenticated" });
    }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(5000, () => console.log("Server running on port 5000"));
