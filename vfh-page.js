const flowStage = document.querySelector('.flow-stage');
const flowNote = document.querySelector('#flow-note');
const flowNotes = {
  standard: '外部送仓涉及车辆、预约、装卸与签收；延误、错仓、拒收及包装破损是需要计入的风险。',
  vfh: '货物留在同一仓内流转，减少外部送仓环节；但 B 区固定面积、人员与转运能力仍要付费和管理。',
};

document.querySelectorAll('.flow-tab').forEach((button) => {
  button.addEventListener('click', () => {
    const flow = button.dataset.flow;
    flowStage.dataset.activeFlow = flow;
    flowNote.textContent = flowNotes[flow];
    document.querySelectorAll('.flow-tab').forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const progress = document.querySelector('.reading-progress');
let pending = false;
function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, window.scrollY / maxScroll) : 0})`;
  pending = false;
}
window.addEventListener('scroll', () => {
  if (!pending) {
    pending = true;
    window.requestAnimationFrame(updateProgress);
  }
}, { passive: true });
updateProgress();

const dialog = document.querySelector('.image-dialog');
const dialogImage = dialog.querySelector('img');
const dialogCaption = dialog.querySelector('p');
document.querySelectorAll('.shot-open').forEach((button) => {
  button.addEventListener('click', () => {
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.dataset.caption;
    dialogCaption.textContent = button.dataset.caption;
    if (typeof dialog.showModal === 'function') dialog.showModal();
  });
});
dialog.querySelector('.image-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
