# Mp3 To AAC
A Node.js module that uses ffmpeg to convert one or more mp3 files to aac (m4a or m4b)

## Installation 
```sh
npm install mp3-to-aac --save
yarn add mp3-to-aac
```

## Usage

### Javascript

```javascript
const mp3ToAac = require('mp3-to-aac');

mp3ToAac("file.mp3", "output.m4a")
```

### TypeScript
```typescript
import mp3ToAac from 'mp3-to-aac';

mp3ToAac("file.mp3", "output.m4a")
```

## Options
You can pass options as the 3rd parameter to the function.

```typescript
{
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
      artist?: string,
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
```
