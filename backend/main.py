from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DownloadRequest(BaseModel):
    url: str
    format: str
    output_dir: str = None

DOWNLOADS_DIR = os.path.expanduser("~/Downloads")

def get_ydl_opts(url: str, format: str, output_dir: str) -> dict:
    is_youtube = "youtube.com" in url or "youtu.be" in url

    base = {
        "outtmpl": f"{output_dir}/%(title)s.%(ext)s",
    }

    if is_youtube:
        base["extractor_args"] = {"youtube": {"player_client": ["android"]}}

    if format == "mp3":
        base["format"] = "bestaudio/best"
        base["postprocessors"] = [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
        }]
    else:
        base["format"] = "bestvideo+bestaudio/best"
        base["merge_output_format"] = "mp4"

    return base

@app.post("/download")
def download(request: DownloadRequest):
    output = request.output_dir if request.output_dir else DOWNLOADS_DIR
    ydl_opts = get_ydl_opts(request.url, request.format, output)

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([request.url])

        return {"status": "ok", "message": "Descargado en tu carpeta de Descargas"}

    except yt_dlp.utils.DownloadError as e:
        error = str(e)
        if "Unsupported URL" in error:
            raise HTTPException(status_code=400, detail="URL no soportada.")
        elif "unavailable" in error or "not available" in error:
            raise HTTPException(status_code=404, detail="El vídeo no está disponible o es privado.")
        elif "DRM" in error:
            raise HTTPException(status_code=403, detail="El vídeo tiene protección DRM.")
        else:
            raise HTTPException(status_code=500, detail="Error al descargar. Revisa el enlace.")