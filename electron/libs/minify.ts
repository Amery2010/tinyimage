import path from 'path'
import imagemin from 'imagemin'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import imageminMozjpeg from 'imagemin-mozjpeg'

type Result = {
  status: boolean,
  data?: imagemin.Result[];
  error?: string;
}

async function minify(filesPath: string | string[], output?: string): Promise<Result> {
  filesPath = typeof filesPath === 'string' ? [filesPath] : filesPath
  return await imagemin(filesPath, {
    destination: output || path.join(path.dirname(filesPath[0]), './output'),
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({
        speed: 1,
        strip: true,
        quality: [0.4, 0.6],
      }),
      imageminSvgo(),
      imageminGifsicle({
        optimizationLevel: 3,
      }),
    ]
  }).then((file) => {
    return {
      status: true,
      data: file,
    }
  }).catch(err => {
    return {
      status: false,
      error: err.toString(),
    }
  })
}

export default minify
