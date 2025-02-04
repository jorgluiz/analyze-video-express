import express from "express";
import cors from "cors";
import morgan from "morgan";
import hbs from "hbs";
import path from 'path';
import fs from "fs";
import youtubedl from 'youtube-dl-exec'

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";

import processTextInChunks from './generateTextAnalysis.js'
import transcribeAudioToText from './transcribeAudioToText.js'

import { getVideoDuration } from "./middlewares.js"

const app = express();


// Configuração do Handlebars para renderizar HTML
app.engine("html", hbs.__express);
app.set("view engine", "html");
app.set("views", path.join(path.resolve(), "src/public/views"));

// Configuração para arquivos estáticos
app.use(express.static(path.join(path.resolve(), "public")));

// Middleware padrão
// A principal finalidade de um Middleware no Express é interceptar e processar 
// requisições e respostas antes que cheguem às rotas ou ao cliente. Ele pode ser usado para:
// 1. Gerenciar requisições (ex.: autenticação, validação, parsing de dados).
// 2. Adicionar funcionalidades globais (ex.: habilitar CORS, logging).
// 3. Tratar erros e responder adequadamente.
// 4. Encadear lógica entre diferentes partes da aplicação.
// Em resumo, middleware conecta e controla o fluxo de dados entre o cliente e o servidor.
app.use(express.json()); // Parse JSON
app.use(cors()); // Habilitar CORS
app.use(morgan("tiny")); // Logger de requisições

// Rotas de páginas
app.get('/home', (req, res) => {
  res.status(200).render("./index");
})
app.get("/", (req, res) => {
  res.redirect("/home");
});

// Rota para análise de vídeo
app.post('/analyze-video', async (req, res) => {
  const { urlVideo } = req.body;
  console.log(urlVideo)
  if (!urlVideo) {
    return res.send("error: empty_url")
  }

  // Garante que a URL comece com "https://www.youtube.com/"
  if (!urlVideo.startsWith("https://www.youtube.com/")) {
    return res.send("error: invalid_domain")
  }

  const duration = await getVideoDuration(urlVideo)
  if (duration === null) {
    return res.send("video longer than 10 minutes");
  }

  // Diretório temporário
  const tempDir = path.resolve(path.resolve(), 'src/downloads');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // Caminhos temporários únicos
  const audioPath = path.resolve(tempDir, 'audio.mp3');
  if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

  try {
    console.time("áudio baixado");
    // Baixa o áudio do vídeo do YouTube
    // A função `youtubedl` é utilizada para executar o download do áudio do vídeo fornecido na URL (`urlVideo`).
    // O áudio será salvo no caminho especificado (`audioPath`) no formato de melhor qualidade disponível (`bestaudio`).
    await youtubedl(urlVideo, { output: audioPath, format: 'bestaudio' });
    console.timeEnd("áudio baixado");

    // Transcreve o áudio para texto
    // A função `transcribeAudioToText` recebe o caminho do arquivo de áudio (`audioPath`) como parâmetro
    // e retorna a transcrição do conteúdo do áudio em formato de texto.
    const transcriptionText = await transcribeAudioToText();
    // Divide o texto transcrito em blocos menores
    // A função `processTextInChunks` recebe o texto transcrito (`transcriptionText`) como entrada
    // e retorna o texto formatado em blocos menores, respeitando o limite de tokens definidos.
    const formatResponse = await processTextInChunks(transcriptionText);
    // console.log(formatResponse)

    res.send(formatResponse);

  } catch (error) {
    console.error(error);
  }

  try {
  } catch (error) {
    console.error(error);
  }
})

// Rotas adicionais
app.use("/hello", helloRoute);

// Middlewares customizados
app.use(middleware.unknownEndpoint); // Tratamento de endpoint desconhecido
app.use(middleware.errorHandler); // Tratamento de erros

export default app;
