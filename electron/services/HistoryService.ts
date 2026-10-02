import {app} from 'electron';import path from 'node:path';import type {DownloadTask} from '../../shared/types.js';import {JsonStore} from './JsonStore.js';
export class HistoryService{private store=new JsonStore<DownloadTask[]>(path.join(app.getPath('userData'),'history.json'),[]);list(){return this.store.read()}add(task:DownloadTask){this.store.write([task,...this.list()].slice(0,200))}}
