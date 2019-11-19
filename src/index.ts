import { spawn, ChildProcess } from "child_process"
import { path as ffmpegPath } from "ffmpeg-static"
import Options from "./Options"
import DefaultOptions from "./DefaultOptions"

/**
 * 
 * @param mp3Path The path to the mp3 to convert or an array of paths of mp3s to combine together and convert
 * @param outputFileName The output name of the converted file (should end in .m4a or .m4b)
 * @param options 
 */
async function mp3ToAac(mp3Path: string | string[], outputFilename: string, options?: Options) {
   const opt = { ...DefaultOptions, ...options }
   var args = ["-i"]
   const metadata = opt.metaDataOverrides
   const coverPicturePath = metadata && metadata.coverPicturePath ? metadata.coverPicturePath : ""

   if (opt.debug) {
      console.debug("mp3Path:", mp3Path)
      console.debug("outputFilename:", outputFilename)
      console.debug("Applied Options:", opt)
   }

   if (mp3Path instanceof Array) {
      args.push(`"concat:${mp3Path.join("|")}"`)
   }
   else {
      args.push(mp3Path)
   }

   if (coverPicturePath) {
      args.push("-i", `"${coverPicturePath}"`)
   }

   args.push("-map", "a:0")

   if (coverPicturePath) {
      args.push("-map", "1")
   }

   args.push("-c:a", "aac")

   if (coverPicturePath) {
      args.push("-vocodec", "copy", "-disposition:1", "attached_pic")
   }

   if (metadata) {
      addMetaData(args, "album", metadata.album)
      addMetaData(args, "author", metadata.author)
      addMetaData(args, "album_artist", metadata.albumArtist)
      addMetaData(args, "grouping", metadata.grouping)
      addMetaData(args, "composer", metadata.composer)
      addMetaData(args, "year", metadata.year)
      addMetaData(args, "track", metadata.trackNumber)
      addMetaData(args, "comment", metadata.comment)
      addMetaData(args, "genre", metadata.genre)
      addMetaData(args, "copyright", metadata.copyright)
      addMetaData(args, "description", metadata.description)
      addMetaData(args, "synopsis", metadata.synopsis)
   }

   args.push(`"${outputFilename}"`)

   if (opt.debug) {
      console.debug(`Running command ${ffmpegPath} ${args.join(" ")}`)
   }

   const ffmpeg = spawn(ffmpegPath, args, { cwd: opt.cwd, windowsVerbatimArguments: true, detached: opt.detached, stdio: opt.pipeStdio ? ["pipe", process.stdout, process.stderr] : undefined })

   await onExit(ffmpeg)

   if (opt.debug) {
      console.debug(`Created file ${outputFilename}`)
   }

}

function addMetaData(args: string[], key: string, value: string | number | undefined) {
   if (value != undefined) {
      args.push("-metadata", `${key}="${value}"`)
   }
}

function onExit(childProcess: ChildProcess): Promise<void> {
   return new Promise((resolve, reject) => {
      childProcess.once('exit', (code: number, signal: string) => {
         if (code === 0) {
            resolve(undefined);
         } else {
            reject(new Error('Exit with error code: ' + code));
         }
      });
      childProcess.once('error', (err: Error) => {
         reject(err);
      });
   });
}


export default mp3ToAac