export function createIconButton(svg, label) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'icon-btn';
  btn.setAttribute('aria-label', label);

  btn.innerHTML = svg;

  return btn
}