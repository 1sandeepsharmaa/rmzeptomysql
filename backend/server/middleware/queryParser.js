const queryParser = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        for (const key in req.body) {
            if (req.body[key] === "true") {
                req.body[key] = true;
            } else if (req.body[key] === "false") {
                req.body[key] = false;
            }
        }
    }
    next();
};

module.exports = queryParser;
