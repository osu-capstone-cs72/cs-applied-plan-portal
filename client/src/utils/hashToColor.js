// Convert any string into a sudo random color.
//
// This function ensures that the same input value
// always returns the same color string.
export function hashToColor(inputString) {

  // create our valid colors array
  const colors = [
    "#ef5350", // red
    "#f087b0", // pink
    "#b45ac3", // purple
    "#7986cb", // blue
    "#4db6ac", // teal
    "#4CAF50", // green
    "#fbc02d", // yellow
    "#fb8c00", // orange
    "#8d6e63"  // brown
  ];

  // convert a string into a numerical value
  let i = 0;
  let number = 0;
  const length = inputString.length;

  if (length > 0) {
    while (i < length) {
      number = (number << 5) - number + inputString.charCodeAt(i++) | 0;
    }
  }

  // use the new number to seed the random number generation
  Math.seed = Math.abs(number);

  // sudo randomly select the index of the colors array
  Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    const rnd = Math.seed / 233280;

    return Math.round(min + rnd * (max - min));
  };

  // return the sudo random color from the colors array
  const selectedIndex = Math.seededRandom(colors.length - 1, 0);
  const selectedColor = colors[selectedIndex];

  return selectedColor;
}