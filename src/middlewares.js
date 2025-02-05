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


import ytdl from '@distube/ytdl-core';

export async function getVideoDuration(urlVideo) {
  try {
    // Obtém os dados do vídeo
    const info = await ytdl.getInfo(urlVideo);

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
