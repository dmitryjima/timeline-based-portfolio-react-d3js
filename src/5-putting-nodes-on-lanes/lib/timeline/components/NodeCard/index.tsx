import formatNodeTime from "../../../utils/formatNodeTime";
import { CARD_WIDTH_PX } from "../../engine/constants";
import type { TimelineNode } from "../../engine/types";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type Props = {
  node: TimelineNode;
};

const NodeCard: React.FC<Props> = ({ node }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: "translate(-50%, -50%)",
        background: "gray",
        color: "white",
        padding: "4px 6px",
        width: `${CARD_WIDTH_PX}px`,
      }}
    >
      {node.id}
      <br />
      {formatNodeTime(node)}
    </div>
  );
};

export default NodeCard;
