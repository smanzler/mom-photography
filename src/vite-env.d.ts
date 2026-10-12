/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IMAGES_URL: string;
  readonly VITE_IMAGE_TRANSFORMS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
