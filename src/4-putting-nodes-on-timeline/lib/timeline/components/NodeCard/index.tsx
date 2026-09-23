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
        background: "gray",
        transform: "translate(-50%, -50%)",
      }}
    >
      {node.id}
    </div>
  );
};

export default NodeCard;
