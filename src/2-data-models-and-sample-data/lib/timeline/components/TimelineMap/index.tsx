import type { TimelineNodeData } from "../../engine/types";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type Props = {
  data: TimelineNodeData[];
};

const TimelineMap: React.FC<Props> = ({ data }) => {
  return <>{JSON.stringify(data)}</>;
};

export default TimelineMap;
