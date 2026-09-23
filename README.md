# Timeline-based portfolio with React and D3.js | Tutorial

This the complete code for the [tutorial](https://www.zdcreatech.com/blog/onclick-tutorials/timeline-based-portfolio-react-d3js) on how to build a responsive timeline-based portfolio with React, TypeScript, and D3.js. 

Each branch in the repository represents a different section of the tutorial, the deployed demo is available [here](https://timeline-based-portfolio-react-d3js.zdcreatech.com).

Feel free to clone/fork/refer to this repository, and build an awesome portfolio that represents you best!

## Installing and running 

This project is based on `npm` and `vite` and was built with Node.js `v24`. 

To install the dependencies, from the root folder run:

```
npm install
```

To run the local dev server:

```
npm run dev
```

To build a production version:

```
npm run build
```

You can also run linting and formatting with `npm run lint` and `npm run format`, respectively. 

## Architecture

The project was scaffolded with the standard Vite project initializer and TypeScript template `npm create . --template react-ts`, uses Eslint and and Prettier for code linting and formatting.

### Core libraries

* [D3.js](https://d3js.org/) - for calculating the layout positions, easings and interpolations
* [sass-embedded](https://www.npmjs.com/package/sass-embedded) - for using `.scss` modules; full counterpart of the [sass](https://www.npmjs.com/package/sass) package, but compatible with the recent versions of 
* [vite-plugin-sass-dts](https://www.npmjs.com/package/vite-plugin-sass-dts) - a plugin for Vite that generates types for `scss` modules on the fly
* [classnames](https://www.npmjs.com/package/classnames) - a library for dynamic styles
* [react-use](https://www.npmjs.com/package/react-use) - a toolbox of React hooks; here used for measuring elements' dimensions.


### Key modules and structure

Most of the code of interest is located in the [src/lib/timeline](src/lib/timeline) folder. There is also a time-formatting function in the [src/lib/utils](src/lib/utils).

* [src/lib/timeline/data](src/lib/timeline/data) - the sample data: a history of education, career milestones and projects. Takes the data as props, passes it to the engine for processing, and then renders the data over the x and y axes.
* [src/lib/timeline/components](src/lib/timeline/components) - contains React Components `TimelineMap` and `NodeCard`.
  * [src/lib/timeline/components/TimelineMap](src/lib/timeline/components/TimelineMap) - "main" component for rendering the timeline. 
  * [src/lib/timeline/components/NodeCard](src/lib/timeline/components/NodeCard) - takes the data for an item as props and renders it as a card.
* [src/lib/timeline/engine](src/lib/timeline/engine) - contains the core parts of the module that handle calculations for the month and year ticks, and the nodes' positions 
  * [src/lib/timeline/engine/constants.ts](src/lib/timeline/engine/constants.ts) - shared constants 
  * [src/lib/timeline/engine/types.ts](src/lib/timeline/engine/types.ts) - shared types and interfaces
  * [src/lib/timeline/engine/lanes.ts](src/lib/timeline/engine/lanes.ts) - logic for distributing the nodes over the lanes and avoiding collisions.
  * [src/lib/timeline/engine/paths.ts](src/lib/timeline/engine/paths.ts) - logic for drawing SVG `path`s to the nodes
  * [src/lib/timeline/engine/index.ts](src/lib/timeline/engine/index.ts) - the `TimelineEngine` class, responsbile for the calculations


[src/App.tsx](App.tsx) is the application's entry point, it imports the sample data, implements a placeholder `handleOnNodeExpand` method, and passes them as props to the `TimelineMap` component. (In a real-life project, the data would likely come from an AJAX call, or fetched in a server-side handler, e.g. in case of Next.js).

## Sections and directories

* [Initial setup and structure](src/1-initial-setup-and-structure)
* [Data models and sample data](src/2-data-models-and-sample-data)
* [Reponsive timeline map](src/3-responsive-timeline-map)
* [Putting nodes on timeline](src/4-putting-nodes-on-timeline)
* [Putting nodes on lanes](src/5-putting-nodes-on-lanes)
* [Drawing lines to nodes](src/6-drawing-lines-to-nodes)
* [Rich content cards](src/7-rich-content-cards)
* [Animating resize](src/8-animating-resize)

## Acknowledgements

The demo project uses free logos and pictures from [Unsplash](https://unsplash.com/) and [UntitledUI](https://www.untitledui.com/) in the sample data.
