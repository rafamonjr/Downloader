const btn = document.getElementById('btn')
const urlInput = document.getElementById('url')
const formatSelect = document.getElementById('format')
const status = document.getElementById('status')
const progressContainer = document.getElementById('progress-container')
const progressBar = document.getElementById('progress-bar')

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

  // Animación mientras espera
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
      body: JSON.stringify({ url, format })
    })

    clearInterval(interval)

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail || 'Error en el servidor')
    }

    progressBar.style.width = '100%'
    status.textContent = '✓ Descargado en tu carpeta de Descargas'

  } catch (err) {
    clearInterval(interval)
    status.textContent = err.message || 'Algo salió mal. Revisa el enlace.'
    progressContainer.style.display = 'none'
  } finally {
    btn.disabled = false
  }
})