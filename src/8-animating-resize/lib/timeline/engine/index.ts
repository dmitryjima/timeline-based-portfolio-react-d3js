import { scaleTime, type ScaleTime } from "d3-scale";
import { easeCubicInOut, interpolateNumber, timeFormat, timeMonth, timeYear } from "d3";
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
  private animationFrame: number | undefined;

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

    this.animateTo(targetLayout);
  }

  // Now we also have a destroy function, to avoid memory leaks if the `TimelineMap` unmounts during the animation
  destroy() {
    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
    }
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

  private animateTo(targetLayout: Map<string, NodeLayout>) {
    // This cancels the next frame, in case the user resizes the window again while the current animation is still running
    // `resize` will calculate a new target layout and start a new animation from the nodes' current positions
    if (this.animationFrame !== undefined) {
      cancelAnimationFrame(this.animationFrame);
    }

    const startTime = performance.now();
    const duration = 400;

    // Create interpolation functions from each node's current position
    // to its target position and store them in a Map.
    // The created functions are equivalent to
    // (t) => a * (1 - t) + b * t
    // and will be evaluated on each animation frame
    const interpolatedLayout = new Map(
      this.timelineNodes.map((node) => [
        node.id,
        {
          x: interpolateNumber(node.x, targetLayout.get(node.id)!.x),
          y: interpolateNumber(node.y, targetLayout.get(node.id)!.y),
          startX: interpolateNumber(node.startX, targetLayout.get(node.id)!.startX),
          endX:
            node.endX !== undefined && targetLayout.get(node.id)!.endX !== undefined
              ? interpolateNumber(node.endX, targetLayout.get(node.id)!.endX!)
              : undefined,
        },
      ]),
    );

    // Callback function passed to `requestAnimationFrame`, that will run on each frame
    // and update nodes' positions, will run until the target layout is reached
    const animationStep = (now: number) => {
      // Calculate the animation progress as a value between 0 and 1, where
      // 0 is the start, and 1 is the end
      const progress = (now - startTime) / duration;
      // `d3-ease` functions expect a normalized value in the [0, 1] range
      // https://d3js.org/d3-ease
      const progressNormalized = Math.min(progress, 1);

      // A cubic ease-in-out, so the animation starts and ends smoothly
      const t = easeCubicInOut(progressNormalized);

      // Iterate over the nodes to evaluate the interpolation for the current frame
      // and apply new coordinates to the node
      for (const node of this.timelineNodes) {
        const interpolation = interpolatedLayout.get(node.id)!;

        node.x = interpolation.x(t);
        node.y = interpolation.y(t);
        node.startX = interpolation.startX(t);

        // `.endX` can be undefined, so interpolate only if present
        if (interpolation.endX) {
          node.endX = interpolation.endX(t);
        }

        // Once the transition finishes, update the side and the lane
        // These are not coordinates, but discrete layout properties, so we don't need to interpolate them
        if (progress === 1) {
          const target = targetLayout.get(node.id)!;
          node.side = target.side;
          node.laneIndex = target.laneIndex;
        }
      }

      // Update the stateful values in the `TimelineMap`, re-rendering the UI with the new positions
      this.syncLayout();

      // Continue the animation loop while the transition is in progress.
      // If we haven't reached 1 yet, call `requestAnimationFrame`
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animationStep);
      } else {
        // If we did, don't call `requestAnimationFrame`, and set the `animationFrame` to `undefined`
        this.animationFrame = undefined;
      }
    };

    // Start the animation loop
    this.animationFrame = requestAnimationFrame(animationStep);
  }
}
