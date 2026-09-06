// VALIDATE EMPLOYEE

export const validateEmployee = (req, res, next) => {
    const {
        first_name,
        last_name,
        email_id,
        department,
        salary
    } = req.body;

    // Check required fields
    if (!first_name || !last_name || !email_id || !department || salary === undefined) {
        return res.status(400).json({
            success: false,
            message: "All required fields must be provided"
        });
    }

    // Check salary
    if (salary <= 0) {
        return res.status(400).json({
            success: false,
            message: "Salary must be greater than 0"
        });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email_id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    // Everything is valid
    next();
};