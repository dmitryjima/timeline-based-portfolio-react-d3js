import "./App.css";
// import TimelineMap from "./lib/timeline/components/TimelineMap/index_naive";
import TimelineMap from "./lib/timeline/components/TimelineMap";
import { data } from "./lib/timeline/data";

function App() {
  return (
    <>
      <main className="main">
        <TimelineMap data={data} />
      </main>
    </>
  );
}

export default App;
