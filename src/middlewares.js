// import youtubedl from 'youtube-dl-exec';

// export async function getVideoDuration(urlVideo) {
//   try {
//     const duration = await youtubedl(urlVideo, { getDuration: true });

//     // Converte a duração para segundos
//     const durationInSeconds = convertDurationToSeconds(duration);
//     // console.log(durationInSeconds)

//     if (durationInSeconds <= 660) {
//       console.log('Vídeo aceito. Duração:', duration);
//       return duration;
//     } else {
//       return null; // Ou pode lançar um erro
//     }
//   } catch (error) {
//     console.error('Erro ao obter duração do vídeo:', error);
//   }
// }

// // Função para converter "HH:MM:SS" ou "MM:SS" em segundos
// function convertDurationToSeconds(duration) {
//   const parts = duration.split(':').map(Number);

//   if (parts.length === 3) {
//     return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
//   } else if (parts.length === 2) {
//     return parts[0] * 60 + parts[1]; // MM:SS
//   }
//   return 0;
// }

// _______________________________________________________________________________________________

import ytdl from '@distube/ytdl-core';
import fs from 'fs';

// Read the cookies from a JSON file
const cookies = JSON.parse(fs.readFileSync('cookies.json'));

const agent = ytdl.createAgent(cookies);

export async function getVideoDuration(urlVideo) {
  try {
    // Obtém os dados do vídeo
    // Obtém as informações do vídeo passando os cookies
    const info = await ytdl.getInfo(urlVideo, { agent })

    // A duração do vídeo está disponível dentro de 'formats'
    const durationInSeconds = info.videoDetails.lengthSeconds;

    if (durationInSeconds <= 660) {
      console.log('Vídeo aceito. Duração:', durationInSeconds, 'segundos');
      return durationInSeconds;
    } else {
      console.log('Vídeo não aceito. Duração:', durationInSeconds, 'segundos');
      return null; // Ou pode lançar um erro
    }
  } catch (error) {
    console.error('Erro ao obter duração do vídeo:', error);
  }
}

//_______________________________________________________________________________________________


// import ytdl from 'ytdl-core';

// export async function getVideoDuration(urlVideo) {
//   try {
//     // Obtém os metadados do vídeo
//     const info = await ytdl.getInfo(urlVideo);

//     // A duração do vídeo em segundos
//     const durationInSeconds = parseInt(info.videoDetails.lengthSeconds, 10);

//     if (durationInSeconds <= 660) {
//       console.log('Vídeo aceito. Duração:', durationInSeconds, 'segundos');
//       return durationInSeconds;
//     } else {
//       console.log('Vídeo não aceito. Duração:', durationInSeconds, 'segundos');
//       return null; // Ou pode lançar um erro
//     }
//   } catch (error) {
//     console.error('Erro ao obter duração do vídeo:', error);
//     return null;
//   }
// }

//_______________________________________________________________________________________________


// import ytScraper from 'yt-scraper';

// export async function getVideoDuration(urlVideo) {
//   try {
//     // Obtém os metadados do vídeo
//     const videoData = await ytScraper.videoInfo(urlVideo);

//     console.log("Duração do vídeo:", videoData.length);

//     if (!videoData || videoData.length == null) {
//       throw new Error('Não foi possível obter a duração do vídeo.');
//     }

//     // Como `videoData.length` já está em segundos, não precisa de conversão
//     const durationInSeconds = Number(videoData.length);

//     if (durationInSeconds <= 660) {
//       console.log('Vídeo aceito. Duração:', durationInSeconds, 'segundos');
//       return durationInSeconds;
//     } else {
//       console.log('Vídeo não aceito. Duração:', durationInSeconds, 'segundos');
//       return null;
//     }
//   } catch (error) {
//     console.error('Erro ao obter duração do vídeo:', error);
//     return null;
//   }
// }
