/* Nippon Data Atlas — hash router. */

import { VIEWS } from './views.js';

const ROUTES = {
  '': 'overview',
  '/': 'overview',
  '/population': 'population',
  '/economy': 'economy',
  '/society': 'society',
  '/regions': 'regions',
};

const TITLES = {
  overview: 'Nippon Data Atlas — Japan in Official Statistics',
  population: 'Population — Nippon Data Atlas',
  economy: 'Economy — Nippon Data Atlas',
  society: 'Society — Nippon Data Atlas',
  regions: 'Regions — Nippon Data Atlas',
};

const state = {
  regionsSort: 'population',
};

const routeFor = () => {
  const hash = location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] || 'overview';
};

function render() {
  const route = routeFor();
  const app = document.getElementById('app');

  app.innerHTML = route === 'regions'
    ? VIEWS.regions(state.regionsSort)
    : VIEWS[route]();

  document.title = TITLES[route];

  document.querySelectorAll('.main-nav a[data-route]').forEach((link) => {
    const active = link.dataset.route === route;
    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  window.scrollTo(0, 0);
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  if (button.dataset.action === 'sort-population') state.regionsSort = 'population';
  else if (button.dataset.action === 'sort-aging') state.regionsSort = 'aging';
  else return;
  render();
});

window.addEventListener('hashchange', render);
render();
