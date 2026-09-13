# WEB film source

User supplied `C:/Users/usewr/Documents/ChatGPT/AI-Video-Studio/06_Exports/ONOFF_FINAL_15s_20260912.mp4`. Original is preserved there. It is a 1280×720, 24fps H.264/AAC film, 15.04 seconds, 13,304,772 bytes. It introduces websites, taking a store online, layout planning, design/function, industry-specific production and search/ongoing marketing.

Web delivery copy is `app/assets/web-showcase/onoff-web-film.mp4`: same framing, duration and frame rate; H.264 CRF21, AAC128k, fast-start MP4, 3,093,276 bytes (76.75% smaller). `web-film-poster.webp` is a 37,644B frame extracted at0.4s. The Korean VTT conveys the visible scene text and background music; the original burned-in lettering remains visible. Chapter controls start at0,4,7,10,13s after inspecting the actual film. Original/output SHA256 and exact encoding settings are in `video-source.json`.

Rebuild with an installed FFmpeg executable:

```powershell
node scripts/prepare-web-film.mjs '<original.mp4>' '<ffmpeg.exe>'
```

No video generation or modification of the adjacent video project. No remote video player, font CDN or new dependency. The runtime film/poster/person URLs use Vite hashes; the production asset check verifies exact bytes and MP4 fast-start metadata.
