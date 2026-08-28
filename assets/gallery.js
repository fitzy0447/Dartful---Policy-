(() => {
  const gallery = document.querySelector('section[style="padding:72px 0"]');
  if (!gallery) return;

  const figures = [...gallery.querySelectorAll('figure')];
  if (!figures.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Enlarged app screenshot');
  lightbox.innerHTML = `
    <div class="gallery-lightbox__content">
      <button class="gallery-lightbox__close" type="button" aria-label="Close enlarged image">&times;</button>
      <img class="gallery-lightbox__image" alt="">
      <div class="gallery-lightbox__caption"></div>
    </div>`;
  document.body.appendChild(lightbox);

  const enlargedImage = lightbox.querySelector('.gallery-lightbox__image');
  const caption = lightbox.querySelector('.gallery-lightbox__caption');
  const closeButton = lightbox.querySelector('.gallery-lightbox__close');
  let previousOverflow = '';

  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = previousOverflow;
  };

  figures.forEach((figure) => {
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', `Enlarge ${figure.querySelector('figcaption')?.textContent.trim() || 'app screenshot'}`);

    const open = () => {
      if (!window.matchMedia('(max-width: 900px)').matches) return;
      const image = figure.querySelector('img');
      if (!image) return;
      enlargedImage.src = image.currentSrc || image.src;
      enlargedImage.alt = image.alt;
      caption.textContent = figure.querySelector('figcaption')?.textContent.trim() || image.alt;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lightbox.classList.add('is-open');
      closeButton.focus();
    };

    figure.addEventListener('click', open);
    figure.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  closeButton.addEventListener('click', close);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
})();
