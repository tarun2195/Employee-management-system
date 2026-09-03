import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Employee Management API is running!");
});

export default app;