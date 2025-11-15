/* Simple site-wide JS: mobile nav, slider, newsletter, comments & reviews simulation */
document.addEventListener('DOMContentLoaded', () => {
  // set years in footers
  for (let i=1;i<=5;i++){
    const el = document.getElementById('year'+(i===1? ''+'' : i));
    // fallback: some pages use different ids
    if (el) el.textContent = new Date().getFullYear();
  }
  const yearEls = document.querySelectorAll('#year');
  yearEls.forEach(e => e.textContent = new Date().getFullYear());

  // mobile nav toggles (multiple pages)
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      // find the sibling nav in header
      const header = btn.closest('.header-inner');
      if (!header) return;
      const nav = header.querySelector('.main-nav');
      if (!nav) return;
      nav.style.display = (nav.style.display === 'flex' ? 'none' : 'flex');
    });
  });

  // slider controls (index)
  const slider = document.getElementById('featuredSlider');
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    let idx = 0;
    const show = (i) => {
      slides.forEach(s=>s.classList.remove('active'));
      slides[(i+slides.length)%slides.length].classList.add('active');
    };
    slider.querySelectorAll('.slide-btn').forEach(b => {
      b.addEventListener('click', ()=>{
        idx += Number(b.dataset.dir || 1);
        show(idx);
      });
    });
    // auto advance
    setInterval(()=>{ idx++; show(idx); }, 6000);
  }

  // newsletter form demo
  const newsletter = document.getElementById('newsletterForm');
  if (newsletter){
    newsletter.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('emailInput').value;
      document.getElementById('newsletterMsg').textContent = `Thanks — ${email} subscribed! (demo)`;
      newsletter.reset();
    });
  }

  // Contact form demo
  const contactForm = document.getElementById('contactForm');
  if (contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      document.getElementById('contactMsg').textContent = 'Message sent! We will reply at your email. (demo)';
      contactForm.reset();
    });
  }

  // Story form demo
  const storyForm = document.getElementById('storyForm');
  if (storyForm){
    storyForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      document.getElementById('storyMsg').textContent = 'Thanks for your story! We will review and may feature it. (demo)';
      storyForm.reset();
    });
  }

  // Search posts (client-side simple filter)
  const searchInput = document.getElementById('searchInput');
  const postsGrid = document.getElementById('postsGrid');
  if (searchInput && postsGrid){
    const cards = Array.from(postsGrid.querySelectorAll('.post-card'));
    searchInput.addEventListener('input', ()=>{
      const q = searchInput.value.trim().toLowerCase();
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
    const clearBtn = document.getElementById('clearSearch');
    if (clearBtn) clearBtn.addEventListener('click', ()=>{ searchInput.value=''; searchInput.dispatchEvent(new Event('input')); });
  }

  // Comments & reviews toggles and local storage simulation
  function attachInteractiveBlocks(selector, storageKeyPrefix){
    document.querySelectorAll(selector).forEach(block => {
      const btn = block.querySelector('.open-comments, .open-reviews');
      const commentsBox = block.querySelector('.comments, .reviews');
      if (btn && commentsBox){
        btn.addEventListener('click', ()=>{
          commentsBox.hidden = !commentsBox.hidden;
        });
        const list = commentsBox.querySelector('.comments-list, .reviews-list');
        const form = commentsBox.querySelector('form');
        const id = storageKeyPrefix + (block.querySelector('h3')?.textContent || Math.random());
        // load existing
        const saved = JSON.parse(localStorage.getItem(id) || '[]');
        saved.forEach(it => {
          const p = document.createElement('p');
          p.className = 'muted small';
          p.textContent = `${it.name} : ${it.text}`;
          list.appendChild(p);
        });
        if (form){
          form.addEventListener('submit', (e)=>{
            e.preventDefault();
            const name = form.querySelector('input')?.value || 'Guest';
            const text = form.querySelector('textarea')?.value || '';
            const p = document.createElement('p');
            p.className = 'muted small';
            p.textContent = `${name} : ${text}`;
            list.prepend(p);
            form.reset();
            saved.unshift({name,text});
            localStorage.setItem(id, JSON.stringify(saved.slice(0,20)));
          });
        }
      }
    });
  }
  attachInteractiveBlocks('.post-card', 'post_comments_');
  attachInteractiveBlocks('.guide-card', 'guide_reviews_');
});
