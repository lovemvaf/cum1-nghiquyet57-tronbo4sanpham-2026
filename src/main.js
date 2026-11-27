import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/400-italic.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/be-vietnam-pro/800.css';

import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';
import './styles/main.css';

import { initIntegratedDeck } from './scripts/deck-controller.js';

window.addEventListener('DOMContentLoaded', () => {
  initIntegratedDeck().catch((err) => {
    console.error('Failed to initialize LẠC HỒNG SỐ V3 presentation app:', err);
  });
});
