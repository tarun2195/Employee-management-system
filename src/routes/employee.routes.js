import express from "express";

import{
    createEmployee,
    deleteEmployee,
    getActiveEmployees,
    getEmployees,
    getEmployeesById,
    updateEmployee
} from "../controllers/employee.controller.js";

const router = express.Router();

//Create employee
router.post("/", createEmployee);

//Fetch employee
router.get("/", getEmployees);

// GET ACTIVE EMPLOYEES
router.get("/active", getActiveEmployees);

//Fetch employee by id
router.get("/:id", getEmployeesById);

//Update employee
router.put("/:id", updateEmployee);

//Delete employee by id
router.delete("/:id", deleteEmployee);

export default router;