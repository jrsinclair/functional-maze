import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

import { maze, renderMazeText } from '../lib/main';

const seed = Date.now();
const n = 40;
const mazeLines = maze(n, seed);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <h2>Maze renderer 3</h2>
    <pre>${renderMazeText(n, mazeLines)}</pre>
  </div>
`;
