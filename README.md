# Simple Maze Tool

## What is this?

This is a simple tool to create a square maze. It’s not especially fast or memory efficient. It’s intented mostly as a learning tool. But it does have some interesting features, discussed below.

## Example mazes

Here is a sample maze, rendered using the unicode text renderer:

```
╶─┬┬┬─┬┬┬┬┬┬┬┬┬┬─┬─┐
╷┌┤╵├╴╵╵│││╵╵│╵│┌┤┌┤
│╵└╴├┐┌─┤││┌─┼┐╵││╵│
├─┬╴│││┌┘││╵╶┤├┐╵╵┌┤
├┐└╴╵││├┐│├╴╶┘╵╵╶─┘│
│╵┌─╴╵╵││││┌───┐╶──┤
├─┴──╴┌┘╵││╵┌┬┬┤╷╷╷│
├─┬──╴╵╷┌┤│┌┤╵╵└┴┴┴┤
│╷└─┬──┘│││╵╵┌┬┬┬──┤
├┴─╴└─╴╷╵╵│╶─┘│╵│╶─┤
├┬─╴┌┐╷│╷╷└╴╶┐│┌┤╷╶┤
│└─┬┘╵├┴┴┘╷┌╴└┘╵╵└┬┤
├─┐└╴┌┼─╴╷││╷╷╶┬╴╶┘│
│╷└─╴╵├╴╶┤││││╷│╷╷╶┤
├┴┬╴╷╶┼╴╶┤│││└┴┼┤└┬┤
├┐╵╶┤╶┤┌╴││││╶─┤├─┤│
│└╴╷│┌┘└┬┴┘│├╴╷╵│╶┘│
├╴╷│││╷╷├╴╶┤│╷│╶┘╶─┤
├╴└┤└┤││└┐╷│├┘│╷╶┐╷╵
└──┴─┴┴┴─┴┴┴┴─┴┴─┴┴╴
```

## Example usage

To generate a maze, we call the `maze()` function.

```javascript
import {maze, renderMazeText} from '@jrsinclair/maze';
const mazeLines = maze(30);
const renderedMaze = renderMazeText(30, mazeLines);
document.querySelector('#maze').innerHTML = '<pre>' + renderedMaze + '</pre>';
```

## Interesting features

The `maze()` function takes a `seed` value as its second argument. Providing a seed makes maze generation deterministic. That is, if you give it the same size and seed, you will always get the same maze.
