#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

fn main() {
    let _ = Command::new("pkill").args(["-f", "uvicorn"]).output();
    std::thread::sleep(std::time::Duration::from_millis(500));

    let backend_path = if cfg!(debug_assertions) {
        std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .unwrap()
            .join("backend")
    } else {
        std::path::PathBuf::from("/Users/rafa/Docs/Projects/Downloader/backend")
    };

    let venv_python = std::path::PathBuf::from("/opt/homebrew/opt/python@3.11/bin/python3.11");

    let result = Command::new("/opt/homebrew/opt/python@3.11/bin/python3.11")
    .args(["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"])
    .current_dir(&backend_path)
    .env("VIRTUAL_ENV", backend_path.join("venv"))
    .env("PATH", format!(
        "{}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin",
        backend_path.join("venv/bin").display()
    ))
    .env("PYTHONPATH", backend_path.join("venv/lib/python3.11/site-packages"))
    .spawn();

    if let Err(e) = result {
        eprintln!("No se pudo lanzar el backend: {}", e);
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .on_window_event(|_window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                let _ = Command::new("pkill").args(["-f", "uvicorn"]).output();
                std::process::exit(0);
            }
        })
        .run(tauri::generate_context!())
        .expect("Error al ejecutar la app");
}