export type Theme = 'system'|'light'|'dark';
export type MediaType = 'video'|'audio';
export type TaskStatus = 'waiting'|'fetching'|'downloading'|'processing'|'completed'|'failed'|'cancelled';
export interface VideoInfo { url:string; title:string; uploader:string; thumbnail?:string; duration:number; heights:number[]; audioBitrates:number[] }
export interface DownloadRequest {url:string;title:string;thumbnail?:string;mediaType:MediaType;format:'mp4'|'mp3'|'m4a';quality:string;outputDirectory:string}
export interface DownloadTask extends DownloadRequest {id:string;status:TaskStatus;progress:number;speed?:string;eta?:string;downloadedBytes?:number;totalBytes?:number;outputPath?:string;createdAt:string;completedAt?:string;error?:string}
export interface Settings {theme:Theme;downloadDirectory:string;defaultVideoQuality:string;defaultAudioFormat:'mp3'|'m4a';defaultMp3Quality:string;concurrentDownloads:number}
export interface BinaryCheck {available:boolean;version?:string;error?:string}
export interface BinaryStatus {appVersion:string;ytDlp:BinaryCheck;ffmpeg:BinaryCheck;ffprobe:BinaryCheck}
export interface PullAPI {metadata(url:string):Promise<VideoInfo>; getSettings():Promise<Settings>;saveSettings(value:Partial<Settings>):Promise<Settings>;chooseDirectory():Promise<string|null>;enqueue(value:DownloadRequest):Promise<DownloadTask>;cancel(id:string):Promise<void>;getTasks():Promise<DownloadTask[]>;getHistory():Promise<DownloadTask[]>;openFile(path:string):Promise<string>;showInFolder(path:string):Promise<void>;status():Promise<BinaryStatus>;onTask(listener:(task:DownloadTask)=>void):()=>void}
