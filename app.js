fetch('objects.json')
  .then(r => r.json())
  .then(objects => {
    const viewport = document.getElementById('viewport');
    const slider = document.getElementById('slider');
    objects.forEach(obj => {
      const el = document.createElement('div');
      el.classList.add('obj');
      el.style.background = obj.color;
      el.title = obj.name;
      el.dataset.size = obj.size;
      viewport.appendChild(el);
    });
    const logs = objects.map(o => Math.log10(o.size));
    const minLog = Math.min(...logs), maxLog = Math.max(...logs);
    slider.addEventListener('input', () => {
      const t = slider.value / slider.max;
      const currentLog = minLog + t * (maxLog - minLog);
      const scale = Math.pow(10, currentLog);
      document.querySelectorAll('.obj').forEach(el => {
        const objSize = parseFloat(el.dataset.size);
        const rel = objSize / scale;
        el.style.left = '50%'; el.style.top = '50%';
        el.style.transform = `translate(-50%,-50%) scale(${rel})`;
        el.style.opacity = rel < 0.001 || rel > 1000 ? 0 : 1;
      });
    });
  });
