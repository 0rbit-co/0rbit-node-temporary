import express from 'express'
import cron from 'node-cron'
import { http } from './lib/http.js'
import { prices } from './lib/prices.js'
import { send } from './services/send.js'

const walletFile = process.env.WALLET_FILE || './wallet.json'

async function poll() {
  const ct = await cron.schedule('*/5 * * * * *', () => {
    console.log('check for messages...')
    ct.stop()
    await http(walletAddress, send);
    //await prices(walletAddress);
    ct.start()
  })
}

const app = express()

app.get('/', (req, res) => {
  res.send('Simple Oracle Service')
})

poll()
app.listen(3000)
