# Bundled binaries

`npm run stage:binaries` copies the platform-specific executables supplied by
`@ffmpeg-installer/ffmpeg` and `@ffprobe-installer/ffprobe` into
`<platform>-<arch>/`. Packaging runs this automatically and `extraResources`
copies this tree outside ASAR to `process.resourcesPath/binaries`.

Development resolves the same dependency executables directly. Packaged builds
never consult `PATH`. Keep `yt-dlp` in each target directory until its installer
is similarly managed.
