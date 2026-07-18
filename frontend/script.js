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

  try {
    const response = await fetch('http://127.0.0.1:8000/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail || 'Error en el servidor')
    }

    const contentLength = response.headers.get('Content-Length')
    const total = parseInt(contentLength, 10)
    let received = 0

    const reader = response.body.getReader()
    const chunks = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      chunks.push(value)
      received += value.length

      if (total) {
        const percent = Math.round((received / total) * 100)
        progressBar.style.width = `${percent}%`
        status.textContent = `Descargando... ${percent}%`
      }
    }

    const blob = new Blob(chunks)
    const downloadUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `descarga.${format}`
    a.click()
    URL.revokeObjectURL(downloadUrl)

    progressBar.style.width = '100%'
    status.textContent = '¡Listo!'

  } catch (err) {
    status.textContent = err.message || 'Algo salió mal. Revisa el enlace.'
    progressContainer.style.display = 'none'
  } finally {
    btn.disabled = false
  }
})