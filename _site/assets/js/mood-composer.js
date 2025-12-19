// Simple Vanilla JS Mood Composer
// Generates dynamic swatches + CSV export
const moods = [
  { name: 'Chill', hex: '#7FD1B9' },
  { name: 'Dreamy', hex: '#B2A1E3' },
  { name: 'Gritty', hex: '#5B5B5B' },
  { name: 'Nostalgic', hex: '#E8C9A1' },
  { name: 'Dark', hex: '#1B1B1B' },
  { name: 'Playful', hex: '#F7A072' },
  { name: 'Hopeful', hex: '#9BD770' },
  { name: 'Lonely', hex: '#A1A7B2' },
];

function createMoodComposer() {
  const root = document.getElementById('mood-composer-root');
  if (!root) return;

  // Create toolbar
  const toolbar = document.createElement('div');
  toolbar.style.display = 'flex';
  toolbar.style.justifyContent = 'space-between';
  toolbar.style.alignItems = 'center';
  toolbar.style.marginBottom = '1rem';

  const title = document.createElement('h2');
  title.textContent = 'Mood Composer';

  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'Export CSV';
  exportBtn.style.padding = '0.5rem 1rem';
  exportBtn.style.border = '1px solid #444';
  exportBtn.style.background = '#000';
  exportBtn.style.color = '#fff';
  exportBtn.style.borderRadius = '6px';
  exportBtn.style.cursor = 'pointer';

  exportBtn.onclick = exportCSV;
  toolbar.append(title, exportBtn);
  root.appendChild(toolbar);

  // Grid
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
  grid.style.gap = '12px';

  moods.forEach((mood) => {
    const card = document.createElement('div');
    card.style.borderRadius = '12px';
    card.style.overflow = 'hidden';
    card.style.border = '1px solid #333';
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.3s ease';
    card.onmouseover = () => (card.style.transform = 'scale(1.04)');
    card.onmouseout = () => (card.style.transform = 'scale(1)');

    const swatch = document.createElement('div');
    swatch.style.height = '80px';
    swatch.style.background = mood.hex;

    const label = document.createElement('div');
    label.style.padding = '0.5rem';
    label.style.fontSize = '0.9rem';
    label.style.textAlign = 'center';
    label.style.background = '#111';
    label.style.color = '#fff';
    label.innerHTML = `<strong>${mood.name}</strong><br><small>${mood.hex}</small>`;

    // placeholder for audio playback later
    card.onclick = () => {
      console.log(`Play sound for ${mood.name}`);
      card.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }],
        {
          duration: 400,
          easing: 'ease-in-out',
        }
      );
    };

    card.appendChild(swatch);
    card.appendChild(label);
    grid.appendChild(card);
  });

  root.appendChild(grid);
}

function exportCSV() {
  const csv = ['name,hex'];
  moods.forEach((m) => csv.push(`${m.name},${m.hex}`));
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'mood_colors.csv';
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', createMoodComposer);
