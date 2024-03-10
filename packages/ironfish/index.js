import express from 'express'
import cors from 'cors'
import { sha256 } from 'js-sha256'

import { createRawTransaction, transactionProofs } from './fish.js'
// require('dotenv').config()

const app = express()
const port = 3080
app.use(cors())
app.use(express.json())

app.post('/getRawTransaction', async (req, res) => {
  try {
    const tx = await createRawTransaction(req.body.from, req.body.to, req.body.amount);
    res.send(tx);
  } catch(e) {
    throw new Error(e);
  }
})

app.post('/getUserTransactionProofs', async (req, res) => {
  try {
    const {userIdCommitment,
      ironfishAccount,
      amountToSpend,
      assetPriceIron,
      assetType,
      fee,
      feePriceIron,
      assetAddress} = req.body
    const {relayProof} = await transactionProofs(
      userIdCommitment,
      ironfishAccount,
      amountToSpend,
      assetPriceIron,
      assetType,
      fee,
      feePriceIron,
      assetAddress);
    res.send({"relayTxProof": relayProof});
  } catch(e) {
    console.log(e)
    res.status(500).send(new Error(e))
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
