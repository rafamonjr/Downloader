#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

fn main() {
    let _ = Command::new("pkill").args(["-f", "uvicorn"]).output();
    std::thread::sleep(std::time::Duration::from_millis(500));

    let backend_path = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("backend");

    let venv_python = backend_path.join("venv/bin/python");

    Command::new(&venv_python)
        .args(["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"])
        .current_dir(&backend_path)
        .spawn()
        .expect("No se pudo lanzar el backend");

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