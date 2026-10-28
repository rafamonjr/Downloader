const btn = document.getElementById('btn')
const urlInput = document.getElementById('url')
const formatSelect = document.getElementById('format')
const status = document.getElementById('status')
const progressContainer = document.getElementById('progress-container')
const progressBar = document.getElementById('progress-bar')

let selectedFolder = null

document.getElementById('folder-btn').addEventListener('click', async () => {
  const folder = await window.__TAURI__.dialog.open({
    directory: true,
    multiple: false,
    title: 'Selecciona carpeta de destino'
  })
  if (folder) {
    selectedFolder = folder
    document.getElementById('folder-label').textContent = folder.split('/').pop()
  }
})

btn.addEventListener('click', async () => {
  const url = urlInput.value.trim()
  const format = formatSelect.value

  if (!url) {
    status.textContent = 'Pega un enlace primero.'
    return
  }

  btn.disabled = true
  progressContainer.style.display = 'block'
  progressBar.style.width = '0%'
  status.textContent = 'Descargando...'

  let progress = 0
  const interval = setInterval(() => {
    if (progress < 90) {
      progress += Math.random() * 3
      progressBar.style.width = `${Math.min(progress, 90)}%`
    }
  }, 300)

  try {
    const response = await fetch('http://127.0.0.1:8000/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format, output_dir: selectedFolder })
    })

    clearInterval(interval)

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail || 'Error en el servidor')
    }

    progressBar.style.width = '100%'
    status.textContent = '✓ Descargado en ' + (selectedFolder ? selectedFolder.split('/').pop() : 'Descargas')

  } catch (err) {
    clearInterval(interval)
    if (err && err.message) {
      status.textContent = err.message
    } else {
      status.textContent = 'Algo salió mal. Revisa el enlace.'
    }
    progressContainer.style.display = 'none'
  } finally {
    btn.disabled = false
  }
})