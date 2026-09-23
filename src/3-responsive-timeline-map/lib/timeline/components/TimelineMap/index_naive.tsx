import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import type { TimelineNodeData, TimelineTick } from "../../engine/types";
import { TimelineEngine } from "../../engine";

const cx = classNames.bind(styles);

type Props = {
  data: TimelineNodeData[];
};

const domainStart = new Date(2017, 0, 1);
const domainEnd = new Date();

const TimelineMap: React.FC<Props> = ({ data }) => {
  const timelineEngineInstanceRef = useRef<TimelineEngine>(null);

  const [yearTicks, setYearTicks] = useState<TimelineTick[]>([]);
  const [monthTicks, setMonthTicks] = useState<TimelineTick[]>([]);

  const handleUpdateTicks = useCallback((yearTicks: TimelineTick[], monthTicks: TimelineTick[]) => {
    setYearTicks(yearTicks);
    setMonthTicks(monthTicks);
  }, []);

  useEffect(() => {
    if (!timelineEngineInstanceRef.current) {
      // Instantiate the TimelineEngine if not present
      timelineEngineInstanceRef.current = new TimelineEngine({
        data,
        domainStart: domainStart,
        domainEnd: domainEnd,
        width: window.innerWidth,
        onUpdateTicks: handleUpdateTicks,
      });
    }
  }, [data, handleUpdateTicks]);

  return (
    <div className={styles["scroll-wrapper"]}>
      {!window.innerWidth ? null : (
        <div className={styles["inner-content"]} style={{ width: window.innerWidth }}>
          <svg
            className={styles["svg-map"]}
            style={{
              width: window.innerWidth,
              height: window.innerHeight,
            }}
            aria-hidden={true}
          >
            {/* Baseline */}
            <line
              className={styles["baseline"]}
              x1={0}
              x2={window.innerWidth}
              y1={window.innerHeight / 2}
              y2={window.innerHeight / 2}
            />

            {/* Month ticks */}
            {monthTicks.map((tick, i) => {
              return (
                <line
                  key={i}
                  className={cx(styles["month-tick"])}
                  x1={tick.x}
                  x2={tick.x}
                  y1={window.innerHeight / 2 - 8 / 2}
                  y2={window.innerHeight / 2 + 8 / 2}
                />
              );
            })}

            {/* Year ticks */}
            {yearTicks.map((tick, i) => {
              return (
                <Fragment key={i}>
                  <text className={styles["year-label"]} x={tick.x} y={18}>
                    {tick.label}
                  </text>
                  <line
                    className={styles["year-tick"]}
                    x1={tick.x}
                    x2={tick.x}
                    y1={0}
                    y2={window.innerHeight}
                  />
                  <text className={styles["year-label"]} x={tick.x} y={window.innerHeight - 12}>
                    {tick.label}
                  </text>
                </Fragment>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};

export default TimelineMap;
