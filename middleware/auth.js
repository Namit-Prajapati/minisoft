const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader, process.env.AUTH_TOKEN)

    if (!authHeader) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (authHeader !== process.env.AUTH_TOKEN) {
        return res.status(402).json({ message: 'Invalid token' });
    }

    next();
};

module.exports = auth;
