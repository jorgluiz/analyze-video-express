// Importa a biblioteca OpenAI para interagir com a API e a biblioteca dotenv para gerenciar variáveis de ambiente.
import OpenAI from "openai"
import { config } from "dotenv"

// Verifica se o ambiente não está em produção. Caso contrário, carrega as variáveis de ambiente a partir do arquivo .env.
if (process.env.NODE_ENV !== "production") {
  config();
}

// Define uma mensagem padrão do sistema que será enviada com cada requisição para a API.
// A mensagem fornece instruções para que o modelo resuma os pontos importantes do texto fornecido.
const systemMessage = {
  role: "system",
  content: "Você está recebendo um texto dividido em múltiplos blocos. Crie um pequeno resumo. Descarte frases como: inscrição estão disponíveis, se inscreva no canal ou frases que pode ser inúteis."
};

// Inicializa o cliente OpenAI com a chave da API definida nas variáveis de ambiente.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define um limite de tokens para cada bloco de texto enviado à API, garantindo que não exceda o limite do modelo.
const MAX_TOKENS = 1000;

/**
 * Função utilitária para dividir um texto em blocos menores com base no limite de tokens.
 * 
 * @param {string} text - Texto a ser dividido.
 * @param {number} maxTokens - Número máximo de tokens permitido por bloco.
 * @returns {Array<string>} - Array contendo os blocos de texto divididos.
 */
function splitTextByTokenLimit(text, maxTokens) {
  const parts = []; // Armazena os blocos de texto.
  let currentPart = ""; // Texto do bloco atual.

  text.split(" ").forEach(word => {
    if ((currentPart + word).trim().length > maxTokens) {
      if (currentPart.trim().length > 0) {
        parts.push(currentPart.trim()); // Adiciona apenas blocos válidos
      }
      currentPart = word + " "; // Inicia um novo bloco
    } else {
      currentPart += word + " "; // Continua preenchendo o bloco atual
    }
  });

  // Adiciona o último bloco, se for válido
  if (currentPart.trim().length > 0) {
    parts.push(currentPart.trim());
  }

  return parts;
}

/**
 * Processa o texto fornecido dividindo-o em blocos menores e enviando cada bloco para a API da OpenAI.
 * 
 * @param {string} data - Texto completo a ser processado.
 * @returns {Promise<string>} - Resumo concatenado gerado pela API.
 */
export default async function processTextInChunks(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const transcribedVideo = data; // Armazena o texto transcrito.
      const parts = splitTextByTokenLimit(transcribedVideo, MAX_TOKENS); // Divide o texto em blocos.
      // console.log(parts)
      let finalResponse = "";

      for (const part of parts) {
        const updatedArray = [
          systemMessage,
          {
            role: "user",
            content: part
          }
        ];

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: updatedArray
        });

        const content = response.choices[0].message.content;
        finalResponse += content + "\n"; // Concatena as respostas
      }

      resolve(finalResponse.trim());
    } catch (error) {
      console.error("Erro na solicitação para a API:", error); // Exibe o erro no console.
      reject(error); // Rejeita a Promise com o erro.
    }
  });
}


// import OpenAI from "openai"
// import { config } from "dotenv"

// if (process.env.NODE_ENV !== "production") {
//   config();
// }

// const systemMessage = {
//   role: "system",
//   content: "Resumo sobre pontos importantes, o que texto destaca e se hover agluma solução. Descarte o que não for importante"
// };

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });


// const MAX_TOKENS = 400; // Defina um limite seguro para cada bloco (ajuste conforme necessário).

// function splitTextByTokenLimit(text, maxTokens) {
//   const parts = [];
//   let currentPart = "";

//   text.split(" ").forEach(word => {
//     if ((currentPart + word).length > maxTokens) {
//       parts.push(currentPart.trim());
//       currentPart = word + " ";
//     } else {
//       currentPart += word + " ";
//     }
//   });

//   if (currentPart.trim().length > 0) {
//     parts.push(currentPart.trim());
//   }

//   return parts;
// }

// // Divide o texto em blocos menores para respeitar o limite de tokens.
// export default async function processTextInChunks(data) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const transcribedVideo = data;
//       const parts = splitTextByTokenLimit(transcribedVideo, MAX_TOKENS);

//       let finalResponse = "";

//       for (const part of parts) {
//         const updatedArray = [
//           systemMessage,
//           {
//             role: "user",
//             content: part
//           }
//         ];

//         const response = await openai.chat.completions.create({
//           model: "gpt-4o",
//           messages: updatedArray
//         });

//         const content = response.choices[0].message.content;
//         finalResponse += content + "\n"; // Concatena as respostas
//       }

//       resolve(finalResponse.trim());
//     } catch (error) {
//       console.error("Erro na solicitação para a API:", error);
//       reject(error);  // Rejeita a Promise com o erro
//     }
//   })
// }