import connection from "../db/database.js";

// CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email_id,
            department,
            salary,
            is_active
        } = req.body;

        const result = await connection.query(
            `INSERT INTO employee
            (first_name, last_name, email_id, department, salary, is_active)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                first_name,
                last_name,
                email_id,
                department,
                salary,
                is_active
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

// GET ALL EMPLOYEES
export const getEmployees = async (req, res) => {
    try {
        const result = await connection.query(
            `SELECT * FROM employee
             ORDER BY hired_at DESC`
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch employees"
        });
    }
};


// GET EMPLOYEE BY ID
export const getEmployeesById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await connection.query(
            `SELECT * FROM employee
             WHERE emp_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch employee"
        });
    }
};

// UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            first_name,
            last_name,
            email,
            department,
            salary,
            is_active
        } = req.body;

        const result = await connection.query(
            `UPDATE employee
             SET
                first_name = $1,
                last_name = $2,
                email_id = $3,
                department = $4,
                salary = $5,
                is_active = $6,
                updated_at = CURRENT_TIMESTAMP
             WHERE emp_id = $7
             RETURNING *`,
            [
                first_name,
                last_name,
                email,
                department,
                salary,
                is_active,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update employee"
        });
    }
};

// DELETE EMPLOYEE (SOFT DELETE)
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await connection.query(
            `UPDATE employee
             SET
                is_active = false,
                updated_at = CURRENT_TIMESTAMP
             WHERE emp_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete employee"
        });
    }
};


// GET ACTIVE EMPLOYEES
export const getActiveEmployees = async (req, res) => {
    try {
        const result = await connection.query(
            `SELECT * FROM employee
             WHERE is_active = true
             ORDER BY updated_at DESC`
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch active employees"
        });
    }
};