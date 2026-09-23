import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMeasure } from "react-use";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import type { TimelineNode, TimelineNodeData, TimelineTick } from "../../engine/types";
import { TimelineEngine } from "../../engine";
import {
  MAX_TIMELINE_HORIZONTAL_PADDING_PER_YEAR_PX,
  MIN_TIMELINE_HORIZONTAL_PADDING_PER_YEAR_PX,
  TIMELINE_HORIZONTAL_PADDING_PX,
  MONTH_TICK_HEIGHT_PX,
  YEAR_LABEL_TOP_OFFSET_PX,
  YEAR_LABEL_BOTTOM_OFFSET_PX,
} from "../../engine/constants";
import NodeCard from "../NodeCard";

const cx = classNames.bind(styles);

type Props = {
  data: TimelineNodeData[];
};

const domainStart = new Date(2017, 0, 1);
const domainEnd = new Date();
const domainYears = domainEnd.getFullYear() - domainStart.getFullYear();
const minContentWidth =
  MIN_TIMELINE_HORIZONTAL_PADDING_PER_YEAR_PX * domainYears + TIMELINE_HORIZONTAL_PADDING_PX * 2;
const maxContentWidth =
  MAX_TIMELINE_HORIZONTAL_PADDING_PER_YEAR_PX * domainYears + TIMELINE_HORIZONTAL_PADDING_PX * 2;

const TimelineMap: React.FC<Props> = ({ data }) => {
  const [scrollElementRef, { width: scrollWrapperWidth, height: scrollWrapperHeight }] =
    useMeasure<HTMLDivElement>();

  const [nodes, setNodes] = useState<TimelineNode[]>([]);
  const handleSetNodes = useCallback((updatedNodes: TimelineNode[]) => {
    setNodes(updatedNodes);
  }, []);

  // Rendered width of the content:
  // do not exceed the `maxContentWidth` constant, but choose the largest between the width of the scroll wrapper and `minContentWidth`
  const contentWidth = useMemo(() => {
    return Math.min(Math.max(scrollWrapperWidth, minContentWidth), maxContentWidth);
  }, [scrollWrapperWidth]);

  // Position of the baseline
  const axisY = useMemo(() => scrollWrapperHeight / 2, [scrollWrapperHeight]);

  const timelineEngineInstanceRef = useRef<TimelineEngine>(null);

  const [yearTicks, setYearTicks] = useState<TimelineTick[]>([]);
  const [monthTicks, setMonthTicks] = useState<TimelineTick[]>([]);

  const handleUpdateTicks = useCallback((yearTicks: TimelineTick[], monthTicks: TimelineTick[]) => {
    setYearTicks(yearTicks);
    setMonthTicks(monthTicks);
  }, []);

  useEffect(() => {
    if (!contentWidth || !axisY) {
      return;
    }

    if (!timelineEngineInstanceRef.current) {
      // Instantiate the TimelineEngine if not present
      timelineEngineInstanceRef.current = new TimelineEngine({
        data,
        domainStart: domainStart,
        domainEnd: domainEnd,
        width: contentWidth,
        axisY,
        onUpdateNodes: handleSetNodes,
        onUpdateTicks: handleUpdateTicks,
      });
    } else {
      // Run `resize` method on change
      timelineEngineInstanceRef.current.resize(contentWidth, axisY);
    }
  }, [contentWidth, axisY, data, handleSetNodes, handleUpdateTicks]);

  return (
    <div className={styles["scroll-wrapper"]} ref={scrollElementRef}>
      {contentWidth === 0 || scrollWrapperHeight === 0 ? null : (
        <div className={styles["inner-content"]} style={{ width: contentWidth }}>
          <svg
            className={styles["svg-map"]}
            style={{
              width: contentWidth,
              height: scrollWrapperHeight,
            }}
            aria-hidden={true}
          >
            {/* Baseline */}
            <line className={styles["baseline"]} x1={0} x2={contentWidth} y1={axisY} y2={axisY} />

            {/* Month ticks */}
            {monthTicks.map((tick, i) => {
              return (
                <line
                  key={i}
                  className={cx(styles["month-tick"])}
                  x1={tick.x}
                  x2={tick.x}
                  y1={axisY - MONTH_TICK_HEIGHT_PX / 2}
                  y2={axisY + MONTH_TICK_HEIGHT_PX / 2}
                />
              );
            })}

            {/* Year ticks */}
            {yearTicks.map((tick, i) => {
              return (
                <Fragment key={i}>
                  <text className={styles["year-label"]} x={tick.x} y={YEAR_LABEL_TOP_OFFSET_PX}>
                    {tick.label}
                  </text>
                  <line
                    className={styles["year-tick"]}
                    x1={tick.x}
                    x2={tick.x}
                    y1={0}
                    y2={scrollWrapperHeight}
                  />
                  <text
                    className={styles["year-label"]}
                    x={tick.x}
                    y={scrollWrapperHeight - YEAR_LABEL_BOTTOM_OFFSET_PX}
                  >
                    {tick.label}
                  </text>
                </Fragment>
              );
            })}
          </svg>

          {/* Node cards */}
          {nodes.map((node) => {
            return <NodeCard key={node.id} node={node} />;
          })}
        </div>
      )}
    </div>
  );
};

export default TimelineMap;
