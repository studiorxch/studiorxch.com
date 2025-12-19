// /assets/js/mood-field.js
console.log('🎨 mood-field geometric grid active (flat edition)')

window.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('moodGrid')
  if (!grid) return

  const styles = getComputedStyle(document.documentElement)
  const moods = []
  for (let i = 0; i < styles.length; i++) {
    const name = styles[i]
    if (name.startsWith('--mood-')) {
      moods.push({
        name: name.replace('--mood-', ''),
        color: styles.getPropertyValue(name).trim(),
      })
    }
  }

  console.log(`🎨 Found ${moods.length} mood vars`)
  grid.innerHTML = ''

  // --- GRID LAYOUT ---
  Object.assign(grid.style, {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, minmax(60px, 1fr))',
    gap: '8px',
    justifyItems: 'center',
    alignItems: 'center',
    padding: '12px',
    boxSizing: 'border-box',
    overflow: 'auto',
  })

  // --- SHAPE STYLES ---
  const randomShape = () => ['circle', 'half'][Math.floor(Math.random() * 2)]
  const randomRotation = () => ['0deg', '90deg', '180deg', '270deg'][Math.floor(Math.random() * 4)]

  moods.forEach((m, i) => {
    const hue = m.color.match(/[\d.]+/g)?.[0] || (i * 15) % 360
    const altHue = (+hue + 80) % 360

    // softened color blending (less neon)
    const gradient = `linear-gradient(
      135deg,
      hsl(${hue}, 70%, 60%),
      hsl(${altHue}, 65%, 55%)
    )`

    const el = document.createElement('div')
    el.className = 'mood-tile'

    const shapeType = randomShape()
    const rotation = randomRotation()

    Object.assign(el.style, {
      width: '60px',
      height: '60px',
      background: gradient,
      borderRadius: shapeType === 'circle' ? '50%' : '100% 100% 0 0',
      transform: `rotate(${rotation})`,
      transition: 'transform 0.2s ease',
      boxShadow: 'none', // 🔥 no shadow ever again
    })

    el.onmouseenter = () => (el.style.transform = `rotate(${rotation}) scale(1.08)`)
    el.onmouseleave = () => (el.style.transform = `rotate(${rotation}) scale(1)`)

    grid.appendChild(el)
  })
})
