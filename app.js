fetch('objects.json')
  .then(res => res.json())
  .then(objects => {
    const viewport = document.getElementById('viewport');
    const indicator = document.getElementById('scaleIndicator');

    // Precompute logs
    const logs = objects.map(o => Math.log10(o.size));
    const minLog = Math.min(...logs);
    const maxLog = Math.max(...logs);

    // Create IMG elements
    objects.forEach(obj => {
      const img = document.createElement('img');
      img.classList.add('obj');
      img.src = obj.img;
      img.alt = obj.name;
      img.dataset.size = obj.size;
      viewport.appendChild(img);
    });

    // On scroll, map scrollY to log-scale
    function update() {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const t = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const currentLog = minLog + t * (maxLog - minLog);
      const scale = Math.pow(10, currentLog);

      // Update each object’s transform & visibility
      document.querySelectorAll('.obj').forEach(el => {
        const objSize = parseFloat(el.dataset.size);
        const rel = objSize / scale;
        el.style.left      = '50%';
        el.style.top       = '50%';
        el.style.transform = `translate(-50%,-50%) scale(${rel})`;
        el.style.opacity   = (rel < 0.001 || rel > 1000) ? 0 : 1;
      });

      // Update scale indicator text
      // e.g. “Scale: 1px = 3.2×10^6 m”
      const pretty = scale.toExponential(2).replace(/e\+?/, '×10^');
      indicator.textContent = `Scale: 1px = ${pretty} m`;
    }

    window.addEventListener('scroll', update);
    // Initial draw
    update();
  })
  .catch(err => console.error(err));
