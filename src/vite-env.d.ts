/// <reference types="vite/client" />
import type { PullAPI } from '../shared/types';
declare global { interface Window { pull: PullAPI } }
export {};
