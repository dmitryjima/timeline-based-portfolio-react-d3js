import type { DisplaySide } from "./types";

export interface LaneAssignment {
  side: DisplaySide;
  laneIndex: number;
}

interface LaneInput {
  id: string;
  startMs: number;
  endMs: number;
  preferredSide?: DisplaySide;
}

function getOppositeSide(side: DisplaySide) {
  if (side === "above") {
    return "below";
  }

  return "above";
}

// Distributes the nodes over the lanes, with 0 being the first level from the baseline/axis
export function assignLanes(
  nodes: LaneInput[],
  requiredGapMs: number,
): Map<string, LaneAssignment> {
  // Sort nodes from earliest to lates, so each lane only needs to track
  // the end time of its most recently assigned node.
  const sortedNodes = nodes.toSorted((a, b) => a.startMs - b.startMs);

  // For each side, store the end time of the last node occupying each lane.
  // The index in the `above` and `below` arrays is the lane number.
  const laneEnds: Record<DisplaySide, number[]> = {
    above: [],
    below: [],
  };

  const result = new Map<string, LaneAssignment>();

  for (const node of sortedNodes) {
    // When no side is preferred, we start with the side that currently has fewer lanes
    // This would keep the timeline map more balanced across the baseline/axis
    const lessUsedSide: DisplaySide =
      laneEnds.above.length <= laneEnds.below.length ? "above" : "below";

    // If node has a preferred side, we try it firs.
    // Otherwise, try the currently less-used side first.
    // In both cases, the opposite side is the fallback
    const sidesToTry: DisplaySide[] = node.preferredSide
      ? [node.preferredSide, getOppositeSide(node.preferredSide)]
      : [lessUsedSide, getOppositeSide(lessUsedSide)];

    let placed = false;

    for (const side of sidesToTry) {
      const lanes = laneEnds[side];

      // Find the first existing lane whose previous node leaves
      // enough horizontal space before this node starts.
      for (let i = 0; i < lanes.length; i++) {
        if (lanes[i] + requiredGapMs <= node.startMs) {
          lanes[i] = node.endMs;
          result.set(node.id, { side, laneIndex: i });
          placed = true;
          break;
        }
      }

      if (placed) {
        break;
      }
    }

    if (!placed) {
      // If we couldn't place a node, it means that none of the existing nodes would do,
      // because they overlap the node. Thuts, we create a new lane on the first side from `sidesToTry`
      const side = sidesToTry[0];

      laneEnds[side].push(node.endMs);

      result.set(node.id, {
        side,
        laneIndex: laneEnds[side].length - 1,
      });
    }
  }

  return result;
}
