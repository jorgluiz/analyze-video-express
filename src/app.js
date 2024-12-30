import express from "express";
import cors from "cors";
import morgan from "morgan";
import hbs from "hbs";
import path from 'path';

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";

const app = express();


// Configuração do Handlebars para renderizar HTML
app.engine("html", hbs.__express);
app.set("view engine", "html");
app.set("views", path.join(path.resolve(), "src/public/views"));

// Configuração para arquivos estáticos
app.use(express.static(path.join(path.resolve(), "public")));

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morgan("tiny"));

// healthcheck endpoint
app.get('/home', (req, res) => {
  res.status(200).render("./index");
})

// Redireciona a rota raiz (/) para /payment-choice
app.get("/", (req, res) => {
  res.redirect("/home");
});

app.use("/hello", helloRoute);

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
