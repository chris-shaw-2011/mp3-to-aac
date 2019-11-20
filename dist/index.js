"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ffmpeg_static_1 = require("ffmpeg-static");
const DefaultOptions_1 = __importDefault(require("./DefaultOptions"));
/**
 *
 * @param mp3Path The path to the mp3 to convert or an array of paths of mp3s to combine together and convert
 * @param outputFileName The output name of the converted file (should end in .m4a or .m4b)
 * @param options
 */
exports.default = async (mp3Path, outputFilename, options) => {
    const opt = { ...DefaultOptions_1.default, ...options };
    var args = ["-i"];
    const metadata = opt.metaDataOverrides;
    const coverPicturePath = metadata && metadata.coverPicturePath ? metadata.coverPicturePath : "";
    if (opt.debug) {
        console.debug("mp3Path:", mp3Path);
        console.debug("outputFilename:", outputFilename);
        console.debug("Applied Options:", opt);
    }
    if (mp3Path instanceof Array) {
        if (mp3Path.length > 1) {
            args.push(`"concat:${mp3Path.join("|")}"`);
        }
        else {
            args.push(`"${mp3Path[0]}"`);
        }
    }
    else {
        args.push(`"${mp3Path}"`);
    }
    if (coverPicturePath) {
        args.push("-i", `"${coverPicturePath}"`);
    }
    args.push("-map", "a:0");
    if (coverPicturePath) {
        args.push("-map", "1");
    }
    args.push("-c:a", "aac");
    if (coverPicturePath) {
        args.push("-vcodec", "copy", "-disposition:1", "attached_pic");
    }
    if (metadata) {
        addMetaData(args, "album", metadata.album);
        addMetaData(args, "artist", metadata.artist);
        addMetaData(args, "album_artist", metadata.albumArtist);
        addMetaData(args, "grouping", metadata.grouping);
        addMetaData(args, "composer", metadata.composer);
        addMetaData(args, "date", metadata.year);
        addMetaData(args, "track", metadata.trackNumber);
        addMetaData(args, "comment", metadata.comment);
        addMetaData(args, "genre", metadata.genre);
        addMetaData(args, "copyright", metadata.copyright);
        addMetaData(args, "description", metadata.description);
        addMetaData(args, "synopsis", metadata.synopsis);
        addMetaData(args, "title", metadata.title);
    }
    args.push(`"${outputFilename}"`);
    if (opt.debug) {
        console.debug(`Running command ${ffmpeg_static_1.path} ${args.join(" ")}`);
    }
    const ffmpeg = child_process_1.spawn(ffmpeg_static_1.path, args, { cwd: opt.cwd, windowsVerbatimArguments: true, detached: opt.detached, stdio: opt.pipeStdio ? ["pipe", process.stdout, process.stderr] : undefined });
    await onExit(ffmpeg);
    if (opt.debug) {
        console.debug(`Created file ${outputFilename}`);
    }
};
function addMetaData(args, key, value) {
    if (value != undefined) {
        if (typeof value == "number") {
            args.push("-metadata", `${key}=${value}`);
        }
        else {
            args.push("-metadata", `${key}="${value.replace("\"", "\\\"")}"`);
        }
    }
}
function onExit(childProcess) {
    return new Promise((resolve, reject) => {
        childProcess.once('exit', (code, signal) => {
            if (code === 0) {
                resolve(undefined);
            }
            else {
                reject(new Error('Exit with error code: ' + code));
            }
        });
        childProcess.once('error', (err) => {
            reject(err);
        });
    });
}
