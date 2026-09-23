import type { TimelineNode } from "../timeline/engine/types";

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export default function formatNodeTime(node: TimelineNode) {
  const formatDate = (date: string) =>
    parseLocalDate(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  if (node.ongoing) {
    return capitalize(`${formatDate(node.date)} - Present`);
  } else if (node.endDate) {
    return `${capitalize(formatDate(node.date))} - ${capitalize(formatDate(node.endDate))}`;
  } else {
    return capitalize(formatDate(node.date));
  }
}
