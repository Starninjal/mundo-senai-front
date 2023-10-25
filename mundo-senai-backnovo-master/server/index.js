import cors from 'cors'
import express, { request, response } from 'express'

import { convert } from './convert.js'
import { convertArchive } from './convertArchive.js'
import { download } from './download.js'
import { transcribe } from './transcribe.js'
import { summarize } from "./summarize.js"


const app = express()
app.use(express.json())
app.use(cors())

app.get('/summary/:id', async (request, response) => {
  try {
    await download(request.params.id)
    const audioConverted = await convert()

    const result = await transcribe(audioConverted)
    const summary = await summarize(result)
    console.log(result)
    console.log(summary)

    response.json({ result, summary })
  } catch (error) {
    console.log(error)
    return response.json({ error })
  }
})

app.get('/archive/:id', async (request, response) => {
  try {
    const audioConvertedByArchive = await convertArchive(decodeURIComponent(request.params.id))
    console.log("entrou");
    const result = await transcribe(audioConvertedByArchive)
    console.log("Reuslt: " + result)
    const summary = await summarize(result)
    console.log(summary)
    response.json({ result, summary })
  } catch (error) {
    console.log(error + Object.keys(error))
    return response.json({ error })
  }

})

// app.post("/summary", async (request, response) => {
//   try{
//     const result = await summarize(request.body.text)
//     return response.json({ result })
//   } catch(error) {
//     console.log(error)
//     return response.json({ error })
//   }
// })
app.listen(3333, () => console.log('Server is running on port 3333'))
