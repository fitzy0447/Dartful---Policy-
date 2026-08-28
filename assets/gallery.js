(() => {
  const liveStyles = document.createElement('style');
  liveStyles.textContent = `@media (max-width:900px){
    .maker-section-live{padding:0 20px 56px!important}
    .maker-card-live{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:22px!important;width:100%!important;min-width:0!important;padding:28px 22px!important;overflow:hidden!important}
    .maker-card-live>*,.maker-card-live p,.maker-card-live a{min-width:0!important;overflow-wrap:anywhere!important}
    .gallery-section-live figure{cursor:zoom-in}
  }`;
  document.head.appendChild(liveStyles);

  const findSection = (selector, text) => [...document.querySelectorAll(selector)]
    .find((element) => element.textContent.trim().toLowerCase() === text)?.closest('section');

  const applyMakerFix = () => {
    const section = document.querySelector('.maker-section') || findSection('p', 'who makes this');
    const card = section?.querySelector('.maker-card') || section?.firstElementChild;
    if (!section || !card) return false;
    section.classList.add('maker-section-live');
    card.classList.add('maker-card-live');
    return true;
  };

  const initialiseGallery = () => {
    const gallery = document.querySelector('.gallery-section') || findSection('h2', 'a look at it');
    if (!gallery) return false;
    if (gallery.dataset.galleryReady === 'true') return true;
    const figures = [...gallery.querySelectorAll('figure')];
    if (!figures.length) return false;
    gallery.dataset.galleryReady = 'true';
    gallery.classList.add('gallery-section-live');

    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Enlarged app screenshot');
    lightbox.innerHTML = `<div class="gallery-lightbox__content"><button class="gallery-lightbox__close" type="button" aria-label="Close enlarged image">&times;</button><img class="gallery-lightbox__image" alt=""><div class="gallery-lightbox__caption"></div></div>`;
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
      const target = figure.querySelector('.gallery-image-link') || figure;
      const image = figure.querySelector('img');
      if (!image) return;
      if (target === figure) {
        figure.tabIndex = 0;
        figure.setAttribute('role', 'button');
      }
      target.setAttribute('aria-label', `Enlarge ${figure.querySelector('figcaption')?.textContent.trim() || image.alt}`);
      const open = (event) => {
        if (!window.matchMedia('(max-width:900px)').matches) return;
        event?.preventDefault();
        enlargedImage.src = image.currentSrc || image.src;
        enlargedImage.alt = image.alt;
        caption.textContent = figure.querySelector('figcaption')?.textContent.trim() || image.alt;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        lightbox.classList.add('is-open');
        closeButton.focus();
      };
      target.addEventListener('click', open);
      if (target === figure) target.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') open(event);
      });
    });

    closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) close();
    });
    return true;
  };

  const applyFixes = () => applyMakerFix() && initialiseGallery();
  if (!applyFixes()) {
    const observer = new MutationObserver(() => { if (applyFixes()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 10000);
  }
})();
