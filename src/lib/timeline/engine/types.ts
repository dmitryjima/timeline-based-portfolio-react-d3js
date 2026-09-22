// Commitments - long-running positions: education, volunteering, and full-time roles
// Projects - standalone projects: gigs, awards, and events
export type NodeType = "commitment" | "project";

// Manual override, otherwise computed by `assignLanes`
export type DisplaySide = "above" | "below";

export interface TimelineNodeData {
  id: string;
  type: NodeType;
  title: string; // Position at a company or name of the project/event
  organization?: string; // Could be a company or a school
  organizationLogoUrl?: string;
  thumbnailUrl?: string;
  summary: string;
  date: string;
  endDate?: string; // Used only for `commitment`
  ongoing?: boolean; // Additional boolean flag for convenience; Used only for `commitment`
  preferredSide?: DisplaySide;
}

export interface TimelineNode extends TimelineNodeData {
  x: number; // x-axis position for the `NodeCard`
  y: number; // y-axis position for the `NodeCard`

  side: DisplaySide;
  startX: number; // point on the baseline/axis where the bridge/stem originates
  endX?: number; // point on the baseline/axis where the bridge returns back (only for `commitment` with endDate)
  laneIndex: number; // index of the lane from 0 to N
  laneY: number; // acutal coordinate y for the node's lane
}

// Year and month ticks on the timeline map
export type TimelineTick = {
  date: Date;
  x: number;
  label: string;
};
