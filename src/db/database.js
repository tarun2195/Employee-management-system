import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const {Pool} = pg;

const connection = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

connection.query("SELECT*from employee", (error, result) =>{
    if(error){
        console.log("Database connection failed", error);
    }else{
        console.log("Database connected successfully");
        console.log(result.rows);
    }
});


export default connection;