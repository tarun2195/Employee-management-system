import express from "express";
import employeeroutes from "../routes/employee.routes.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Employee Management API is running!");
});

app.use("/api/employees", employeeroutes);

export default app;