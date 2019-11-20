import Options from "./Options";
declare const _default: (mp3Path: string | string[], outputFilename: string, options?: Options | undefined) => Promise<void>;
/**
 *
 * @param mp3Path The path to the mp3 to convert or an array of paths of mp3s to combine together and convert
 * @param outputFileName The output name of the converted file (should end in .m4a or .m4b)
 * @param options
 */
export default _default;
