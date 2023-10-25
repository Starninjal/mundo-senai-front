import { server } from "./server.js"

const form = document.querySelector("#form")
const input = document.querySelector("#url")
const content = document.querySelector("#content")
const transcribe = document.querySelector("#transcribe")

form.addEventListener("submit", async (event) => {
  event.preventDefault()
  content.classList.add("placeholder")

  const videoURL = input.value

  if (!videoURL.includes("shorts")) {
    return content.textContent = "Esse vídeo não parece ser um Shorts"
  }

  const [_, params] = videoURL.split("/shorts/")
  const [videoId] = params.split("?si")

  content.textContent = "Obtendo o texto do áudio..."

  const transcription = await server.get("/summary/" + videoId)

  content.textContent = "Realizando o resumo..."
  content.textContent = transcription.data.result

  const summary = await server.get("/summary/" + videoId, {
    text: transcription.data.summary
  })

  transcribe.textContent = summary.data.summary
  content.classList.remove("placeholder")
})
