import './style.css';

import { maze, renderMazeSVG, renderMazeText, roomsToList } from '../lib/main';

// const seed = Date.now();
const seed = 1720301682563;
const n = 16;

const mazeRooms = maze(n, seed);

const WALL_SIZE = 25;

const mazeAsList = roomsToList(mazeRooms);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Simple Maze Tool</h1>
    <h2>What is this?</h2>
    <p>This is a simple tool to create a square maze. It’s not especially fast or memory efficient.
       It’s intented mostly as a learning tool. But it does have some interesting features,
       discussed below.</p>
    <h2>Example Mazes</h2>
    <p>Here is a maze using the improved algorithm, renedered using the unicode text renderer:</p>
    <pre class="TextMaze">${renderMazeText(n, mazeRooms)}</pre>
    <p>Here is the same maze, rendered using the SVG renderer:</p>
    <figure class="SVGMaze">${renderMazeSVG(n, WALL_SIZE, mazeRooms)}</figure>
    <p>The seed for these mazes was ${seed}</p>
    <h2>Accessible rendering</h2>
    <div class="accessibleMaze">${mazeAsList}</div>
    <p><small>Sprites by <a href="http://www.indiedb.com/games/instant-dungeon">Scott Matott</a> used under the Open Game Art license (OGA-BY-3.0).</small></p>
    <h2>Example usage</h2>
    <p>To generate a maze, we call the <code>maze()</code> function.</p>
    <pre><code>import {maze, renderMazeText} from '@jrsinclair/maze';
const mazeRooms = maze(30);
const renderedMaze = renderMazeText(30, mazeRooms);
document.querySelector('#maze').innerHTML = '&lt;pre>' + renderedMaze + '&lt;/pre>';
</code></pre>
    <h2>Interesting features</h2>
    <p>The <code>maze()</code> function takes a <code>seed</code> value as its second argument.
       Providing a seed makes maze generation deterministic. That is, if you give it the same size
       and seed, you will always get the same maze.</p>
  </div>
`;
