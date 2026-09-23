import { scaleTime, type ScaleTime } from "d3-scale";
import { timeFormat, timeMonth, timeYear } from "d3";
import type { TimelineNodeData, TimelineNode, TimelineTick } from "./types";
import { assignLanes } from "./lanes";
import {
  CARD_WIDTH_PX,
  LANE_BASE_OFFSET_PX,
  LANE_GAP_PX,
  TIMELINE_HORIZONTAL_PADDING_PX,
} from "./constants";

const formatYear = timeFormat("%Y");
const formatMonth = timeFormat("%b");

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
      // The earliest and latest dates on the timeline
      .domain([this.domainStart, this.domainEnd])
      // The range of px from the left-most side to the right-most side
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
      side: "above",
      laneIndex: 0,
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
    const domain = this.xScale.domain();
    const range = this.xScale.range();

    const msPerPx = (domain[1].getTime() - domain[0].getTime()) / (range[1] - range[0]);

    const cardWidthMs = CARD_WIDTH_PX * msPerPx;

    const lanes = assignLanes(
      this.timelineNodes.map((node) => ({
        id: node.id,
        startMs: new Date(node.date).getTime(),
        endMs: this.endOf(node).getTime(),
        preferredSide: node.preferredSide,
      })),
      cardWidthMs,
    );

    return new Map<string, NodeLayout>(
      this.timelineNodes.map((node) => {
        const startX = this.xScale(new Date(node.date));
        const endX = this.xScale(this.endOf(node));

        const { side, laneIndex } = lanes.get(node.id)!;
        const direction = side === "above" ? -1 : 1;

        return [
          node.id,
          {
            x: (startX + endX) / 2,
            y: axisY + direction * (LANE_BASE_OFFSET_PX + laneIndex * LANE_GAP_PX),
            startX,
            endX: node.endDate || node.ongoing ? endX : undefined,
            side,
            laneIndex,
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
