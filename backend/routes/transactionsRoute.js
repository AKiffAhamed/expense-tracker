import express from "express"
import {getTransactionByUserId,getSummaryByUserID,createTransaction,deleteTransaction} from "../controllers/transactionController.js"

const router = express.Router();

router.get("/:userId",getTransactionByUserId);
router.delete("/:id",deleteTransaction);
router.post("/",createTransaction);
router.get("/summary/:userId",getSummaryByUserID);

export default router;