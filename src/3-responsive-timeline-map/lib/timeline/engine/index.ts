import { scaleTime, type ScaleTime } from "d3-scale";
import { timeFormat, timeMonth, timeYear } from "d3";
import type { TimelineNodeData, TimelineTick } from "./types";
import { TIMELINE_HORIZONTAL_PADDING_PX } from "./constants";

const formatYear = timeFormat("%Y");
const formatMonth = timeFormat("%b");

type ConstructorParameters = {
  data: TimelineNodeData[];
  width: number;
  domainStart: Date;
  domainEnd: Date;
  onUpdateTicks: (yearTicks: TimelineTick[], monthTicks: TimelineTick[]) => void;
};

export class TimelineEngine {
  private xScale: ScaleTime<number, number>;
  private domainStart: Date;
  private domainEnd: Date;
  private onUpdateTicks: (yearTicks: TimelineTick[], monthTicks: TimelineTick[]) => void;

  constructor({
    width,
    domainStart = new Date(2017, 0, 1),
    domainEnd = new Date(),
    onUpdateTicks,
  }: ConstructorParameters) {
    this.domainStart = domainStart;
    this.domainEnd = domainEnd;
    this.onUpdateTicks = onUpdateTicks;

    // "Naive" version - no norizontal padding
    // this.xScale = scaleTime()
    //   // The earliest and latest dates on the timeline
    //   .domain([this.domainStart, this.domainEnd])
    //   // The range of px from the left-most side to the right-most side
    //   .range([0, width]);

    this.xScale = scaleTime()
      // The earliest and latest dates on the timeline
      .domain([this.domainStart, this.domainEnd])
      // The range of px from the left-most side to the right-most side
      .range([
        TIMELINE_HORIZONTAL_PADDING_PX,
        Math.max(width - TIMELINE_HORIZONTAL_PADDING_PX, TIMELINE_HORIZONTAL_PADDING_PX),
      ]);

    this.syncLayout();
  }

  resize(newWidth: number) {
    // "Naive" version - no norizontal padding
    // this.xScale = scaleTime()
    //   // The earliest and latest dates on the timeline
    //   .domain([this.domainStart, this.domainEnd])
    //   // The range of px from the left-most side to the right-most side
    //   .range([0, newWidth]);

    this.xScale.range([
      TIMELINE_HORIZONTAL_PADDING_PX,
      Math.max(newWidth - TIMELINE_HORIZONTAL_PADDING_PX, TIMELINE_HORIZONTAL_PADDING_PX),
    ]);

    this.syncLayout();
  }

  private syncLayout() {
    this.updateTicks();
  }

  private updateTicks() {
    const yearTicks: TimelineTick[] = timeYear
      .range(this.domainStart, this.domainEnd)
      .map((date) => ({
        date,
        x: this.xScale(date),
        label: formatYear(date),
      }));

    const monthTicks: TimelineTick[] = timeMonth
      .range(this.domainStart, this.domainEnd)
      .filter((date) => date.getMonth() !== 0) // Skip January, as it matches the positions of `yearTicks`
      .map((date) => ({
        date,
        x: this.xScale(date),
        label: formatMonth(date),
      }));

    this.onUpdateTicks(yearTicks, monthTicks);
  }
}
