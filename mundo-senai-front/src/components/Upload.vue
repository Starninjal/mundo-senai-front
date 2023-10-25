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

      <body>
        <div class="container" style="display: flex; gap: 10px;">
          <div class="bloco1">
            <div class="square">
              <div class="container2"
                style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 40px;">
                <img src="Logo.png" alt="Logo">
                <h1>Shorts Summary</h1>

              </div>
              <div class="container-upload">
                <div class="input-group mb-3">
                  <input type="file" class="form-control" id="inputGroupFile02" v-on:change="getPath">
                  <label class="input-group-text" for="inputGroupFile02">Upload</label>
                </div>
              </div>
            </div>

            <div class="square" style="display: flex; justify-content: center;">
              <div class="container-frame" style="margin-top: 20px;">
                <video ref="videoPlayer" controls>
                  <source :src="filePath" type="video/mp4">
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </div>
            </div>
          </div>
          <div class="bloco2">
            <div class="square" style="display: flex;justify-content: center; height: 420px;;" id="square3">
              <div class="container-transcricao" style="margin-top: 20px; max-width: 600px;">
                <div class="text" style="display: flex; justify-content: center; margin-top: 40px;">
                  <h2>Transcrição</h2>
                </div>

                <p> {{ transcription }}</p>
              </div>
            </div>
            <div class="square" id="square4" style="display: flex; justify-content: center;">
              <div class="container-resumo" style="margin-top: 20px; max-width: 600px;
                  ">
                <div class="text" style="display: flex; justify-content: center;">
                  <h2>Resumo</h2>
                </div>
                <p> {{ summary }}</p>
              </div>
            </div>

          </div>
        </div>
      </body>
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

  .container-upload label {
    background-color: #8d0801;
    border: none;
    color: white;
  }

  .container-upload {
    width: 80%;
    margin-left: 50px;
    margin-top: 20px;
  }

  .container-upload input {
    background-color: #202024;
    color: white;
    border: none;

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

  .container2 h1 {
    font-size: 40px;
    margin-top: 0;
  }

  .bloco2 h2 {
    font-size: 30px;
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
        path: '',
        filePath: '',
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
      async conversaoPorArquivo(event: Event) {
        event.preventDefault()
        console.log("entrou")
        const response = await http.get("/archive/" + encodeURIComponent(this.path))
        console.log(encodeURIComponent(this.arquivoUrl))
        this.conversao.transcribe = response.data.result;
        this.conversao.summarize = response.data.summary;
        this.transcription = this.conversao.transcribe;
        this.summary = this.conversao.summarize;
      },
      getPath(event: Event) {
        var fileInput = event.target as HTMLInputElement;

        if (fileInput.files && fileInput.files.length > 0) {
          this.path = fileInput.value;
          const pathSplit = this.path.split("\\")
          pathSplit[1] = 'audios'
          const paths = pathSplit.slice(0, 3).join("\\")
          console.log(paths)
          this.path = paths;

          this.filePath = URL.createObjectURL(fileInput.files[0])
          console.log(this.filePath)
          const videoPlayer =  this.$refs.videoPlayer as HTMLVideoElement

          if(videoPlayer) {
            videoPlayer.play()
            console.log('entrou');
          }

          this.conversaoPorArquivo(event);
        }
      }
    }
  });
  </script>
    
    
    