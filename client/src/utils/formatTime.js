// convert a timestamp to a human readable time
export function formatTime(timestamp) {
  return new Date(Date.parse(timestamp))
    .toLocaleTimeString("en-US", {dateStyle: "medium", timeStyle: "short"});
}