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
