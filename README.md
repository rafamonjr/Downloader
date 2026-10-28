# Downloader

App de escritorio para descargar vídeos y audio de YouTube, TikTok e Instagram en MP4 y MP3, sin publicidad ni marcas de agua.

## Stack

- **Backend:** Python · FastAPI · yt-dlp · ffmpeg
- **Desktop:** Rust · Tauri
- **Frontend:** HTML · CSS · JavaScript vanilla

## Funcionalidades

- Descarga de YouTube, TikTok e Instagram
- Exporta en MP4 o MP3
- Selector de carpeta de destino
- Barra de progreso animada
- El backend arranca y se apaga automáticamente con la app

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
git clone https://github.com/rafamonjr/Downloader.git
cd Downloader
```

2. Crea el entorno virtual e instala dependencias:
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Instala las dependencias de Tauri:
```bash
brew install rust
cargo install tauri-cli
```

4. Compila la app:
```bash
cargo tauri build
```

El `.dmg` estará en `src-tauri/target/release/bundle/macos/`.

## Estructura

Downloader/
├── backend/
│ ├── main.py
│ └── requirements.txt
├── frontend/
│ ├── index.html
│ ├── style.css
│ └── script.js
└── src-tauri/
├── src/main.rs
└── tauri.conf.json



## Autor

Rafa — [github.com/rafamonjr](https://github.com/rafamonjr)