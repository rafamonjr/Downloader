from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import yt_dlp
import os
import tempfile
import shutil

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

def get_ydl_opts(url: str, format: str, tmp_dir: str) -> dict:
    is_youtube = "youtube.com" in url or "youtu.be" in url

    base = {
        "outtmpl": f"{tmp_dir}/%(title)s.%(ext)s",
    }

    if is_youtube:
        base["extractor_args"] = {"youtube": {"player_client": ["android_vr"]}}

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
    tmp_dir = tempfile.mkdtemp()

    try:
        ydl_opts = get_ydl_opts(request.url, request.format, tmp_dir)

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([request.url])
        except yt_dlp.utils.DownloadError as e:
            error = str(e)
            if "Unsupported URL" in error:
                raise HTTPException(status_code=400, detail="URL no soportada. Prueba con YouTube, Instagram o TikTok.")
            elif "unavailable" in error or "not available" in error:
                raise HTTPException(status_code=404, detail="El vídeo no está disponible o es privado.")
            elif "DRM" in error:
                raise HTTPException(status_code=403, detail="El vídeo tiene protección DRM y no se puede descargar.")
            else:
                raise HTTPException(status_code=500, detail="Error al descargar. Revisa el enlace.")

        files = os.listdir(tmp_dir)
        if not files:
            raise HTTPException(status_code=500, detail="No se generó ningún archivo.")

        file = files[0]
        file_path = os.path.join(tmp_dir, file)
        file_size = os.path.getsize(file_path)

        return FileResponse(
            path=file_path,
            filename=file,
            media_type="application/octet-stream",
            headers={"Content-Length": str(file_size)}
        )

    except HTTPException:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        raise