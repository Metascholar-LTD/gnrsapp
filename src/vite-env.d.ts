/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOMTOM_API_KEY?: string;
  readonly VITE_MAPBOX_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  jQuery: any;
  $: any;
  WOW: any;
}

declare const jQuery: any;
declare const $: any;
declare const WOW: any;