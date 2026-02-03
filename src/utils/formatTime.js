export const _formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";

  try {
    const postTime = new Date(timestamp);
    const now = new Date();
    const diffInMilliseconds = now - postTime;

    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years}y ago`;
    } else if (months > 0) {
      return `${months}mo ago`;
    } else if (weeks > 0) {
      return `${weeks}w ago`;
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "just now";
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "";
  }
};

export const _formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.replace(" ", "T"));

  const options = {
    weekday: "long", // "Tuesday"
    year: "numeric",
    month: "long", // "August"
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
};
