import path from 'path'
import imagemin from 'imagemin'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import imageminMozjpeg from 'imagemin-mozjpeg'

type Result = {
  data: Buffer;
  sourcePath: string;
  destinationPath: string;
}

async function minify(filesPath: string[]): Promise<Result[]> {
  return await imagemin(filesPath, {
    destination: path.join(path.dirname(filesPath[0]), './output'),
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant(),
      imageminSvgo(),
      imageminGifsicle(),
    ]
  })
}

export default minify
