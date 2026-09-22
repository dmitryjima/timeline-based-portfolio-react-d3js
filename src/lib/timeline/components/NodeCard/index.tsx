import { Fragment, useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames/bind";
import { CARD_CLOSED_HEIGHT_PX, CARD_WIDTH_PX } from "../../engine/constants";
import { type TimelineNode } from "../../engine/types";
import formatNodeTime from "../../../utls/formatNodeTime";

const cx = classNames.bind(styles);

type Props = {
  node: TimelineNode;
  onExpand: (node: TimelineNode) => void;
};

const NodeCard: React.FC<Props> = ({ node, onExpand }) => {
  const cardButtonRef = useRef<HTMLButtonElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse") {
      setPreviewOpen(true);
    }
  };
  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse") {
      setPreviewOpen(false);
    }
  };

  const expand = () => {
    onExpand(node);
  };

  const handleClick = () => {
    if (!previewOpen) {
      setPreviewOpen(true);
      return;
    }
    expand();
  };

  useEffect(() => {
    if (!previewOpen || !cardButtonRef.current) {
      return;
    }

    const onDocPointerDown = (e: PointerEvent) => {
      if (!cardButtonRef.current?.contains(e.target as HTMLElement)) {
        setPreviewOpen(false);
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
    };
  }, [previewOpen]);

  return (
    <div
      className={cx(styles["wrapper"], {
        open: previewOpen,
      })}
      style={{
        left: `${node.x}px`,
        // Makes sure that the card is centered vertically
        // we avoid transform(-50%, -50%) for both x and y to make sure the card always opens downwards
        top: `calc(${node.y}px - ${CARD_CLOSED_HEIGHT_PX / 2}px)`,
      }}
    >
      <button
        ref={cardButtonRef}
        type="button"
        className={cx(styles["card-button"], {
          commitment: node.type === "commitment",
          project: node.type === "project",
          open: previewOpen,
        })}
        style={
          {
            "--card-width": `${CARD_WIDTH_PX}px`,
          } as React.CSSProperties
        }
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        aria-expanded={previewOpen}
      >
        <div className={styles["content"]}>
          {node.thumbnailUrl ? (
            <div
              className={cx(styles["thumbnail-wrapper"], {
                hidden: !previewOpen,
                visible: previewOpen,
              })}
            >
              <img alt={node.title} src={node.thumbnailUrl} />
            </div>
          ) : null}
          <div className={styles["title"]}>{node.title}</div>

          <div className={styles["organization"]}>
            {node.organizationLogoUrl ? (
              <img
                alt={node.organization}
                className={styles["logo"]}
                width={24}
                height={24}
                src={node.organizationLogoUrl}
              />
            ) : null}
            <span className={styles["name"]}>{node.organization}</span>
          </div>
          {previewOpen ? (
            <Fragment>
              <div className={styles["date"]}>{formatNodeTime(node)}</div>
              <div className={styles["summary"]}>{node.summary}</div>
              <div className={styles["hint"]}>Click to expand</div>
            </Fragment>
          ) : null}
        </div>
      </button>
    </div>
  );
};

export default NodeCard;
