import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({
            success: false,
            message: "Unauthorized access"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id) {
            req.userId = decoded.id;  // Set userId in the request object
        } else {
            return res.json({
                success: false,
                message: "Unauthorized access. Invalid token."
            });
        }

        next();  // Pass control to the next middleware/route handler
    } catch (error) {
        console.error(error.message);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export default authUser;

