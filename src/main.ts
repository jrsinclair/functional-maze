import './style.css';

import { maze, renderMazeText } from '../lib/main';

const seed = Date.now();
const n = 20;
const mazeLines = maze(n, seed);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Simple Maze Tool</h1>
    <h2>What is this?</h2>
    <p>This is a simple tool to create a square maze. It’s not especially fast or memory efficient.
       It’s intented mostly as a learning tool. But it does have some interesting features,
       discussed below.</p>
    <h2>Example Mazes</h2>
    <p>Here is a sample maze, rendered using the unicode text renderer:</p>
    <pre class="TextMaze">${renderMazeText(n, mazeLines)}</pre>
    <h2>Example usage</h2>
    <p>To generate a maze, we call the <code>maze()</code> function.</p>
    <pre><code>import {maze, renderMazeText} from '@jrsinclair/maze';
const mazeLines = maze(30);
const renderedMaze = renderMazeText(30, mazeLines);
document.querySelector('#maze').innerHTML = '&lt;pre>' + renderedMaze + '&lt;/pre>';
</code></pre>
    <h2>Interesting features</h2>
    <p>The <code>maze()</code> function takes a <code>seed</code> value as its second argument.
       Providing a seed makes maze generation deterministic. That is, if you give it the same size
       and seed, you will always get the same maze.</p>
  </div>
`;
