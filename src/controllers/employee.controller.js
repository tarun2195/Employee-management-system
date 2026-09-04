import connection from "../db/database.js";

// CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            department,
            salary
        } = req.body;

        const result = await connection.query(
            `INSERT INTO employee
            (first_name, last_name, email, department, salary)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                first_name,
                last_name,
                email,
                department,
                salary
            ]
        );

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create employee"
        });
    }
};