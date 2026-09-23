import { scaleTime, type ScaleTime } from "d3-scale";
import { timeFormat, timeMonth, timeYear } from "d3";
import type { TimelineNodeData, TimelineNode, TimelineTick } from "./types";
import { TIMELINE_HORIZONTAL_PADDING_PX } from "./constants";

const formatYear = timeFormat("%Y");
const formatMonth = timeFormat("%b");

// Local helper type that holds only data for the coordinates
type NodeLayout = Pick<TimelineNode, "x" | "y" | "startX" | "endX" | "side" | "laneIndex">;

type ConstructorParameters = {
  data: TimelineNodeData[];
  width: number;
  axisY: number; // the y of the baseline/axis, content height / 2
  domainStart: Date;
  domainEnd: Date;
  onUpdateNodes: (nodes: TimelineNode[]) => void;
  onUpdateTicks: (yearTicks: TimelineTick[], monthTicks: TimelineTick[]) => void;
};

export class TimelineEngine {
  private xScale: ScaleTime<number, number>;
  private domainStart: Date;
  private domainEnd: Date;
  private timelineNodes: TimelineNode[];
  private onUpdateNodes: (nodes: TimelineNode[]) => void;
  private onUpdateTicks: (yearTicks: TimelineTick[], monthTicks: TimelineTick[]) => void;

  constructor({
    data,
    width,
    axisY,
    domainStart = new Date(2017, 0, 1),
    domainEnd = new Date(),
    onUpdateNodes,
    onUpdateTicks,
  }: ConstructorParameters) {
    this.domainStart = domainStart;
    this.domainEnd = domainEnd;
    this.onUpdateNodes = onUpdateNodes;
    this.onUpdateTicks = onUpdateTicks;

    this.xScale = scaleTime()
      // The input set, earliest and latest dates
      .domain([this.domainStart, this.domainEnd])
      // The output set, actual pixel coordinates on SVG
      .range([
        TIMELINE_HORIZONTAL_PADDING_PX,
        Math.max(width - TIMELINE_HORIZONTAL_PADDING_PX, TIMELINE_HORIZONTAL_PADDING_PX),
      ]);

    // Initialize the nodes
    this.timelineNodes = data.map((d) => ({
      ...d,
      x: 0,
      y: axisY,
      startX: 0,
      endX: undefined,
      side: "above", // placeholder for now
      laneIndex: 0, // placeholder for now
    }));

    const targetLayout = this.calculateLayout(axisY);

    this.applyLayout(targetLayout);
  }

  resize(newWidth: number, newAxisY: number) {
    this.xScale.range([
      TIMELINE_HORIZONTAL_PADDING_PX,
      Math.max(newWidth - TIMELINE_HORIZONTAL_PADDING_PX, TIMELINE_HORIZONTAL_PADDING_PX),
    ]);

    const targetLayout = this.calculateLayout(newAxisY);

    this.applyLayout(targetLayout);
  }

  // Helper function to determine the end date of a node
  private endOf(d: TimelineNodeData): Date {
    if (d.endDate) {
      return new Date(d.endDate);
    } else if (d.ongoing) {
      return this.domainEnd;
    } else {
      return new Date(d.date);
    }
  }

  private syncLayout() {
    this.onUpdateNodes([...this.timelineNodes]);
    this.updateTicks();
  }

  private updateTicks() {
    const yearTicks = timeYear.range(this.domainStart, this.domainEnd).map((date) => ({
      date,
      x: this.xScale(date),
      label: formatYear(date),
    }));

    const monthTicks = timeMonth
      .range(this.domainStart, this.domainEnd)
      .filter((date) => date.getMonth() !== 0) // Skip January, as it matches the positions of `yearTicks`
      .map((date) => ({
        date,
        x: this.xScale(date),
        label: formatMonth(date),
      }));

    this.onUpdateTicks(yearTicks, monthTicks);
  }

  private calculateLayout(axisY: number) {
    return new Map<string, NodeLayout>(
      this.timelineNodes.map((node) => {
        const startX = this.xScale(new Date(node.date));
        const endX = this.xScale(this.endOf(node));

        return [
          node.id,
          {
            // Since `endOf` returns the same date for a `project` we don't need any `if...else`'s here:
            // (x + x) / 2 = x
            x: (startX + endX) / 2,
            y: axisY,
            startX,
            endX: node.endDate || node.ongoing ? endX : undefined,
            side: "above", // placeholder for now
            laneIndex: 0, // placeholder for now
          },
        ];
      }),
    );
  }

  private applyLayout(layout: Map<string, NodeLayout>) {
    for (const node of this.timelineNodes) {
      const target = layout.get(node.id)!;

      node.x = target.x;
      node.y = target.y;
      node.startX = target.startX;
      node.endX = target.endX;
      node.side = target.side;
      node.laneIndex = target.laneIndex;
    }
    this.syncLayout();
  }
}
