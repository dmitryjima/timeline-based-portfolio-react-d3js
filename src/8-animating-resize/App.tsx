import "./App.css";
import TimelineMap from "./lib/timeline/components/TimelineMap";
import { data } from "./lib/timeline/data";
import type { TimelineNode } from "./lib/timeline/engine/types";

function App() {
  const handleOnNodeExpand = (node: TimelineNode) => {
    alert(
      `
Triggered expand for node with id "${node.id}"
______________

Here you would put the logic for the most interesting parts: opening the modal, handling a programmatic redirect, etc. 
You could also extend the function to pass the DomRect of the card, or a ref to the element itself to implement visual effects and animations.
      `,
    );
  };

  return (
    <>
      <main className="main">
        <TimelineMap data={data} onNodeExpand={handleOnNodeExpand} />
      </main>
    </>
  );
}

export default App;
