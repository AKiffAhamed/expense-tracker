import express from "express"
import { sql } from "../config/db.js";

const router = express.Router();

router.get("/:userId",async(req,res) => {
    try {
        const {userId} = req.params;
        
        const transaction = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `
        res.status(200).json(transaction);

    } catch (error) {
        console.log("Eroor in the getting transaction:", error);
        res.status(500).json({message:"Internal server error"});
    }
})

router.delete("/:id",async(req,res) =>{
    try {
        const {id} = req.params;

        if(isNaN(parseInt(id))) {
            return res.status(400).json({message:"Invalid Transaction ID"});
        }

        const result = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `
        if(result.length === 0){
            return res.status(404).json({message:"Transaction not found"})
        }

        res.status(404).json({message:"Transaction Deleted succsessfully"})

    } catch (error) {
        console.log("Eroor in the deleting transaction:", error);
        res.status(500).json({message:"Internal server error"});
    }
})

router.post("/", async (req, res) => {
    //title, amount, catogary, user_id
    try {
        const {title,amount,category,user_id} = req.body

        if(!title|| !category || !user_id || amount === undefined ){
            return res.status(400).json({message:"All fields are required"})
        }

        const transaction = await sql`
            INSERT INTO transactions(title,amount,category,user_id)
            VALUES (${title},${amount},${category},${user_id})
            RETURNING *
        `;

        console.log(transaction);
        res.status(201).json(transaction[0]);

    } catch (error) {
        console.log("Eroor in the creating transaction:", error)
        res.status(500).json({message:"Internal server error"})
    }
});

//view balance, income , expence totals
router.get("/summary/:userId",async (req,res) => {
    try {
        const {userId} = req.params;
        
        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount),0) as income FROM transactions 
            WHERE user_id = ${userId} AND amount > 0
        `
        const expenceResult = await sql`
            SELECT COALESCE(SUM(amount),0) as expences FROM transactions 
            WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expences: expenceResult[0].expences
        })

    } catch (error) {
        console.log("Eroor getting the summary:", error);
        res.status(500).json({message:"Internal server error"});
    }
})

export default router;