// /assets/js/mood-dropper.js
document.addEventListener('DOMContentLoaded', () => {
  const dropperBtn = document.getElementById('moodDropper')
  if (!dropperBtn || !window.EyeDropper) return

  const dropper = new EyeDropper()
  dropperBtn.addEventListener('click', async () => {
    try {
      const result = await dropper.open()
      const mood = nearestMood(result.sRGBHex)
      console.log(`🎯 Picked ${result.sRGBHex} → ${mood}`)
      alert(`Closest mood → ${mood}`)
    } catch (e) {
      console.log('🎨 Dropper canceled')
    }
  })
})
