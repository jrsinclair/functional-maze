import './style.css';

import { maze, renderMazeText, mazeImproved, renderMazeSVG, graphToWalls } from '../lib/main';
import { range } from '../lib/util';
import { p } from '../lib/point';

// const seed = Date.now();
const seed = 1720301682563;
const n = 50;
// const mazeLines = maze(n, seed);
const improvedMazeLines = graphToWalls(n, mazeImproved(seed, n - 1));

const WALL_SIZE = 25;
const innerWalls = range(n - 1)
    .map((y) =>
        range(n - 1)
            .map((x) => {
                const pointX = (x + 1) * WALL_SIZE;
                const pointY = (y + 1) * WALL_SIZE;
                return `
    <path class="wall" id="east-wall-${x}-${y}" d="M ${pointX + WALL_SIZE} ${pointY} L ${
                    pointX + WALL_SIZE
                } ${pointY + WALL_SIZE}" />
    <path class="wall" id="south-wall-${x}-${y}" d="M ${pointX} ${pointY + WALL_SIZE} L ${
                    pointX + WALL_SIZE
                } ${pointY + WALL_SIZE}" />`;
            })
            .join(''),
    )
    .join('');
console.log(innerWalls);
console.log(p(3,5));
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Simple Maze Tool</h1>
    <h2>What is this?</h2>
    <p>This is a simple tool to create a square maze. It’s not especially fast or memory efficient.
       It’s intented mostly as a learning tool. But it does have some interesting features,
       discussed below.</p>
    <h2>Example Mazes</h2>
    <p>Here is a maze using the improved algorithm, renedered using the unicode text renderer:</p>
    <pre class="TextMaze">${renderMazeText(n, improvedMazeLines)}</pre>
    <p>Here is one more maze, rendered using the SVG renderer:</p>
    <div>${renderMazeSVG(n-1, WALL_SIZE, improvedMazeLines)}</div>
    <p>The seed for these mazes was ${seed}</p>
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
