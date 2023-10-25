<template>
  <head>
    <meta charset="UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="icon" type="image/svg+xml" href="/Logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <title>Shorts Summary</title>
  </head>
  <body>
    <div class="container" style="display: flex; gap: 10px;">
        <div class="bloco1">
            <div class="square">
                <div class="container2"
                    style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 40px;">
                    <img src="Logo.png" alt="Logo">
                    <h1>Shorts Summary</h1>
                    <form @submit.prevent="conversaoTexto" id="form">
                        <input type="url" id="url" placeholder="Insira a URL" v-model="inputValue">
                        <button type="submit">
                            <i class="ph ph-play"></i>
                        </button>
                    </form>
                </div>

            </div>
            <div class="square" style="display: flex; justify-content: center;">
                <div class="container-frame" style="margin-top: 20px;">
                    <iframe width="600" height="300" :src="videoUrl"
                        title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                    gyroscope; picture-in-picture;
                    web-share" allowfullscreen></iframe>
                </div>
            </div>
        </div>
        <div class="bloco2">
            <div class="square" style="display: flex;justify-content: center; height: 420px;;" id="square3">
                <div class="container-transcricao" style="margin-top: 20px; max-width: 600px;">
                  <div class="text" style="display: flex; justify-content: center; margin-top: 40px;">
                    <h2>Transcrição</h2>
                  </div>
                    
                    <p> {{transcription}}</p>
                </div>
            </div>
            <div class="square" id="square4" style="display: flex; justify-content: center;">
                <div class="container-resumo" style="margin-top: 20px; max-width: 600px;
                ">
                <div class="text" style="display: flex; justify-content: center;">
                    <h2>Resumo</h2>
                  </div>
                    <p> {{summary}}</p>
                </div>
            </div>
            <router-link to="/upload">sadsad</router-link>
        </div>
    </div>
  </body>
 

</template>

<style scoped>

  body {
    color: white;
    background-color: #121214;
  }

  ::placeholder {
    color: white;
  }

        .square {
            width: 650px;
            /* 50% da altura da tela */
            height: 50vh;
            /* 50% da altura da tela */
            /* Cor de fundo, pode ser alterada */
        }

        #form {
            margin-top: 2px;
            display: flex;
            gap: 12px;
        }

        #form input {
            height: 48px;
            width: 550px;
            border: none;
            color: #fff;
            background-color: #202024;
            border-radius: 5px;
            padding: 0 12px;
            font-size: 16px;
        }

        #form input:focus {
            outline: 2px solid #8d0801;
        }

        #form>input:valid {
            background-color: #202024;
        }

        #form>button {
            height: 48px;
            width: 48px;
            border: none;
            border-radius: 5px;
            background-color: #8d0801;

            cursor: pointer;
            transition: background-color .2s;
        }

        #form>button:hover {
            background-color: #30638e;
        }

        #form>button i {
            font-size: 24px;
            color: #202024;
        }

        #square4 {
            height: 200px;
        }

        .container2 img {
          margin-bottom: 20px;
          width: 100px;
        }

        .container2 h1{
          font-size: 40px;
          margin-top: 0;
        }

        .bloco2 h2 {
          font-size:30px;
        }



        .text {
          margin-top: 20px;
        }
</style>


<script lang="ts">
import http from '@/http'
import type Conversao from '@/interfaces/Conversao'
import axios from 'axios';
import { defineComponent } from 'vue'

export default defineComponent({
  name: "Conversao",
  data() {
    return {
      inputValue: '',
      conversao: {} as Conversao,
      transcription: '',
      summary: '',
      videoUrl: '',
      arquivoUrl: '',
      paginaDestino: '/upload'
    }
  },

  methods: {
    async conversaoTexto() {
      this.transcription = "";
      this.summary = "";
      const urlDoVideo = this.inputValue.split('/');
      urlDoVideo[3] = "embed";
      const urlSplit = urlDoVideo.slice(0, 4).join("/") + "/" + urlDoVideo[4];
      this.videoUrl = urlSplit;
      console.log(urlSplit)
      const url = this.inputValue.split('/'); 

      const response = await http.get("/summary/" + url[4])
      this.conversao.transcribe = response.data.result;
      this.conversao.summarize = response.data.summary;

      console.log(this.conversao.summarize);
      console.log(this.conversao.transcribe);
      
      // this.summary = this.conversao.summarize;
      this.transcription = this.conversao.transcribe;
      this.summary = this.conversao.summarize;
      this.$forceUpdate();
    },
    async conversaoPorArquivo() {
      console.log("entrou")
      const response = await http.get("/archive/" + encodeURIComponent(this.arquivoUrl))
      console.log(encodeURIComponent(this.arquivoUrl))
      this.conversao.transcribe = response.data.result;
      this.conversao.summarize = response.data.summary;
      this.transcription = this.conversao.transcribe;
      this.summary = this.conversao.summarize;
    }
  }
});
</script>


