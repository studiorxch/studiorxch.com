let moodValue = 0; // A variable to control the animation

function setup() {
  // 1. Create the canvas to fill the entire window
  createCanvas(windowWidth, windowHeight);

  // 2. Set initial drawing properties
  strokeWeight(25); // Set the thickness of the line (your 25px height)
  noFill(); // We only want the line, not a filled shape
}

function draw() {
  // 1. Reset the background (clear the previous frame)
  background(21, 21, 21); // Your charcoal color: #151515 in RGB

  // 2. Update the moodValue (for animation)
  // This smoothly oscillates the value between -1 and 1
  moodValue = sin(frameCount * 0.05);

  // 3. Map the moodValue to a color (e.g., green to magenta)
  let hue = map(moodValue, -1, 1, 120, 300); // 120 is green, 300 is magenta
  colorMode(HSB, 360, 100, 100); // Set color mode to Hue/Saturation/Brightness
  stroke(hue, 80, 80); // Set the line color

  // 4. Draw the Mood Bar (a single horizontal line)
  let y_position = height / 2; // Position it exactly in the vertical center

  // Draw the line from the far left (0) to the far right (width)
  line(0, y_position, width, y_position);

  // OPTIONAL: Add a subtle ripple animation to the line
  // let ripple = map(moodValue, -1, 1, 0, 5);
  // line(0, y_position + ripple, width, y_position - ripple);
}

// 5. Important: Resize the canvas when the user resizes the browser window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
