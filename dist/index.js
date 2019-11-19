"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var ffmpeg_static_1 = require("ffmpeg-static");
var DefaultOptions_1 = __importDefault(require("./DefaultOptions"));
/**
 *
 * @param mp3Path The path to the mp3 to convert or an array of paths of mp3s to combine together and convert
 * @param outputFileName The output name of the converted file (should end in .m4a or .m4b)
 * @param options
 */
function mp3ToAac(mp3Path, outputFilename, options) {
    return __awaiter(this, void 0, void 0, function () {
        var opt, args, metadata, coverPicturePath, ffmpeg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opt = __assign(__assign({}, DefaultOptions_1.default), options);
                    args = ["-i"];
                    metadata = opt.metaDataOverrides;
                    coverPicturePath = metadata && metadata.coverPicturePath ? metadata.coverPicturePath : "";
                    if (mp3Path instanceof Array) {
                        args.push("\"concat:" + mp3Path.join("|") + "\"");
                    }
                    else {
                        args.push(mp3Path);
                    }
                    if (coverPicturePath) {
                        args.push("-i", "\"" + coverPicturePath + "\"");
                    }
                    args.push("-map", "a:0");
                    if (coverPicturePath) {
                        args.push("-map", "1");
                    }
                    args.push("-c:a", "aac");
                    if (coverPicturePath) {
                        args.push("-vocodec", "copy", "-disposition:1", "attached_pic");
                    }
                    if (metadata) {
                        addMetaData(args, "album", metadata.album);
                        addMetaData(args, "author", metadata.author);
                        addMetaData(args, "album_artist", metadata.albumArtist);
                        addMetaData(args, "grouping", metadata.grouping);
                        addMetaData(args, "composer", metadata.composer);
                        addMetaData(args, "year", metadata.year);
                        addMetaData(args, "track", metadata.trackNumber);
                        addMetaData(args, "comment", metadata.comment);
                        addMetaData(args, "genre", metadata.genre);
                        addMetaData(args, "copyright", metadata.copyright);
                        addMetaData(args, "description", metadata.description);
                        addMetaData(args, "synopsis", metadata.synopsis);
                    }
                    args.push("\"" + outputFilename);
                    if (opt.debug) {
                        console.debug("Running command " + ffmpeg_static_1.path + " " + args.join(" "));
                    }
                    ffmpeg = child_process_1.spawn(ffmpeg_static_1.path, args, { cwd: opt.cwd, windowsVerbatimArguments: true, detached: opt.detached, stdio: opt.pipeStdio ? ["pipe", process.stdout, process.stderr] : undefined });
                    return [4 /*yield*/, onExit(ffmpeg)];
                case 1:
                    _a.sent();
                    if (opt.debug) {
                        console.debug("Created file " + outputFilename);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function addMetaData(args, key, value) {
    if (value != undefined) {
        args.push("-metadata", key + "=\"" + value + "\"");
    }
}
function onExit(childProcess) {
    return new Promise(function (resolve, reject) {
        childProcess.once('exit', function (code, signal) {
            if (code === 0) {
                resolve(undefined);
            }
            else {
                reject(new Error('Exit with error code: ' + code));
            }
        });
        childProcess.once('error', function (err) {
            reject(err);
        });
    });
}
exports.default = mp3ToAac;
