export default interface Options {
   /**
    * Current working directory for ffmpeg process
    */
   cwd?: string,
   /**
    * If the ffmpeg process should be detached from the existing process. If false killing the node process will kill ffmpeg
    * @default false
    */
   detached?: boolean,
   /**
    * If stdio should be piped to the current console
    * @default true
    */
   pipeStdio?: boolean,
   /**
    * Write debugging output to the console?
    * @default false
    */
   debug?: boolean,
   /**
    * Metadata overrides. By default ffmpeg will copy any metadata on the mp3 to the output file, these will allow you to specify your own metadata
    */
   metaDataOverrides?: {
      title?: string,
      author?: string,
      albumArtist?: string,
      album?: string,
      grouping?: string,
      composer?: string,
      year?: number,
      trackNumber?: number,
      comment?: string,
      genre?: string,
      copyright?: string,
      description?: string,
      synopsis?: string,
      /**
       * The path for the cover photo that should be added to the file
       */
      coverPicturePath?: string,
   }
}
