import express from 'express'
import cors from 'cors'
import { sha256 } from 'js-sha256'
import pkg from 'node-cron';
const {schedule} = pkg;
import { createRawTransaction, getSpendLimit, transactionProofs, checkAndUpdateSupply } from './fish.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const port = 3080
app.use(cors())
app.use(express.json())

const task = schedule('* * * * *', async () =>  {
  checkAndUpdateSupply()
});

task.start();

app.post('/getRawTransaction', async (req, res) => {
  try {
    const tx = await createRawTransaction(req.body.from, req.body.to, req.body.amount, req.body.memo);
    res.send(tx);
  } catch(e) {
    res.status(500).send(new Error(e))
  }
})

app.post('/getUserTransactionProofs', async (req, res) => {
  try {
    const {userIdCommitment,
      amountToSpend,
      assetPriceIron,
      assetType,
      fee,
      feePriceIron,
      assetAddress} = req.body
    const {relayProof} = await transactionProofs(
      userIdCommitment,
      amountToSpend,
      assetPriceIron,
      assetType,
      fee,
      feePriceIron,
      assetAddress);
    res.send({"relayTxProof": relayProof});
  } catch(e) {
    res.status(500).send(new Error(e))
  }
})

app.post('/getSpendLimit', async (req, res) => {
  try {
    const {commitment} = req.body
    const spendLimit = await getSpendLimit(commitment)
    res.send({"spendlimit": spendLimit})
  } catch(e) {
    res.status(500).send(new Error(e))
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
