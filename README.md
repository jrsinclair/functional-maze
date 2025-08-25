# Simple Maze Tool

## What is this?

This is a simple tool to create a square maze. It’s not especially fast or memory efficient. It’s intended mostly as a learning tool. But it does have some interesting features, discussed below.

## Example mazes

Here is a sample maze, rendered using the unicode text renderer:

```
┌──┬┬───────────┐
│╶┐╵│╶┬─┬─┬─┐╶─┐│
│╷├╴├╴│╷│╷╵╷└─┐└┤
││└─┤┌┘│││┌┴─┐└┐│
│└┬┐╵├╴││└┘┌╴├╴││
├┐│└─┘╶┴┴──┤╶┤┌┘│
││└─┬─┐╶┬╴╷├╴│└╴│
│└┬╴│╷└─┤╶┴┤╶┼─╴│
│╶┤╶┘├─┐│┌┐└┐├─┐│
│╷└──┘╷│││└┐│╵╷││
│├┬───┤╵│╵╷│└┬┘├┤
││╵╶┬┐└─┴─┼┴╴│╶┘│
│└┬╴╵├─╴┌╴│╶─┴──┤
├┐│┌─┤╶─┤╶┴┬──┐╷│
││└┘╷└─┐└┬╴│┌╴│└┤
│└──┴─╴└╴│╶┘│╶┴╴│
└────────┴──┴───┘
```

## Example usage

To generate a maze, we call the `maze()` function.

```javascript
import {maze, renderMazeText, renderMazeSVG, renderMazeAsList} from '@jrsinclair/maze';

// Generate the maze graph.
const mazeRooms = maze(30);

// Render the maze as text.
const mazeText = renderMazeText(30, mazeRooms);
document.querySelector('#maze-text').innerHTML = `<pre>${mazeText}</pre>`;

// Render the maze as SVG
const mazeSVG = renderMazeSVG(30, mazeRooms);
document.querySelector('#maze-svg').innerHTML = `<div>${mazeSVG}</div>`;

// Render maze as an accessible HTML list
const mazeList = renderMazeAsList(mazeRooms);
document.querySelector('#maze-list').innerHTML = mazeList;
```

## Interesting features

The `maze()` function takes a `seed` value as its second argument. Providing a seed makes maze generation deterministic. That is, if you give it the same size and seed, you will always get the same maze.

## Getting started

### Using as an npm package

To use this code in another project, it's usually easiest to import it as an [npm package](https://www.npmjs.com/package/@jrsinclair/functional-maze). Add it to your repository using something like:

```
npm i @jrsinclair/functional-maze
```

Then, inside your project file:

```javascript
import { maze, renderMazeText } from '@jrsinclair/functional-maze';

const seed = Date.now();
const n = 45;
const mazeRooms = maze(n, seed);
const mazeTxt = renderMazeText(n, mazeRooms);
console.log(mazeTxt);
```

### Cloning the repository locally

If you want to work with this repository locally, the repository is set up to use `yarn` by default. To install:

```
git clone git@github.com:jrsinclair/functional-maze.git
cd functional-maze
yarn
```

You can run a simple web server that will demo three different renderers with:

```
yarn dev
```
