# Downloader

Web app para descargar vídeos y audio de YouTube, TikTok e Instagram en MP4 y MP3, sin publicidad ni marcas de agua.

## Stack

- **Backend:** Python, FastAPI, yt-dlp, ffmpeg
- **Frontend:** HTML, CSS, JavaScript vanilla

## Requisitos

- Python 3.11+
- ffmpeg
- yt-dlp

En Mac con Homebrew:
```bash
brew install ffmpeg yt-dlp
```

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tuusuario/downloader.git
cd downloader
```

2. Crea el entorno virtual e instala dependencias:
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Uso

1. Arranca el backend:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

2. Abre `frontend/index.html` en el navegador.

3. Pega un enlace de YouTube, TikTok o Instagram, elige el formato y descarga.

## Estructura

```
downloader/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Autor

Rafael Montañés — [github.com/rafamonjr](https://github.com/rafamonjr)