import connection from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const registerUser= async(req,res) =>{
    try{
        const{
            email,
            password,
            role,
            employee_id
        } = req.body;

        if(!email|| !password || !role || !employee_id){
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({
                message: "Invalid role"
            });

        }

        const employee = await pool.query(
            
            "SELECT * FROM employee WHERE id = $1",
            [employee_id]
        );

        if(employee.rows.length === 0){
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const existingUser = await pool.query(
           "SELECT * FROM users WHERE email = $1",
           [email]
        );

        if(existingUser.rows.length>0){
            return res.status(400).json({
                message:"User already exists"
            });
        };

        const hashPassword = await bcrypt.hash(password,10);

        await pool.query(
            "INSERT INTO users (email, password,role,employee_id) VALUES ($1,$2,$3,$4) ",
            [email , hashPassword , role, employee_id]
        );

        res.status(201).json({
            message: "User registered successfully"
        });
    }
    catch(error){
        res.status(500).json({
            message : error.message
        });
    }
}

export const loginUser = async (req, res) => {
    try{
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        };

        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if(user.rows.length ===0){
            return res.status(401).json({
                message: "Unauthorized"
            });
        };

        const isMatch= await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if(!isMatch){
            return res.status(401).json({
                message:"Incorrect Password"
            });
        };

    const token = jwt.sign(
    {
        id : user.rows[0].id,
        role : user.rows[0].role,
        employee_id : user.rows[0].employee_id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    });
    return res.status(200).json({
        message: "Login successful",
        token
    });
    
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};