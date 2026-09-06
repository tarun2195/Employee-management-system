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
         const {
      page = 1,
      limit = 10,
      search,
      department,
      sortBy= "hired_at",
      order= "desc"
    } = req.query;

    // convert to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // calculate offset
    const offset = (pageNum - 1) * limitNum;

     // allow only specific columns for sorting
    const allowedSortFields = ["salary", "hired_at"];

    const sortColumn = allowedSortFields.includes(sortBy)
      ? sortBy
      : "hired_at";

    // allow only ASC or DESC
    const sortOrder = order.toLowerCase() === "asc"
      ? "ASC"
      : "DESC";

   let result;

        if (search && department) {
            // prepare search value with wildcards
            const searchValue = `%${search}%`;

            result = await connection.query(
                `SELECT * FROM employee
                 WHERE (first_name ILIKE $1
                    OR last_name ILIKE $1
                    OR email_id ILIKE $1)
                    AND department = $2
                 ORDER BY ${sortColumn} ${sortOrder}
                 LIMIT $3 OFFSET $4`,
                [searchValue, department, limitNum, offset]
            );

        } else if (search) {
            // search only
            const searchValue = `%${search}%`;

            result = await connection.query(
                `SELECT * FROM employee
                 WHERE first_name ILIKE $1
                    OR last_name ILIKE $1
                    OR email_id ILIKE $1
                 ORDER BY ${sortColumn} ${sortOrder}
                 LIMIT $2 OFFSET $3`,
                [searchValue, limitNum, offset]
            );

        } else if (department) {
            // department filter only
            result = await connection.query(
                `SELECT * FROM employee
                 WHERE department = $1
                 ORDER BY ${sortColumn} ${sortOrder}
                 LIMIT $2 OFFSET $3`,
                [department, limitNum, offset]
            );

        } else {
            // no search and no department filter
            result = await connection.query(
                `SELECT * FROM employee
                 ORDER BY ${sortColumn} ${sortOrder}
                 LIMIT $1 OFFSET $2`,
                [limitNum, offset]
            );
        }

        res.status(200).json({
            success: true,
            data: result.rows,
            page: pageNum,
            limit: limitNum
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
                is_active = $6
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