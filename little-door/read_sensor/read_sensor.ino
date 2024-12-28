#define garageSensor1 12 // D6

void setup() {
  // Initialize Serial for debugging
  Serial.begin(9600);
  
  // Configure garageSensor1 as INPUT_PULLUP
  pinMode(garageSensor1, INPUT_PULLUP);

  Serial.println("Setup complete. Checking garageSensor1 state...");
}

void loop() {
  // Read the state of garageSensor1
  int sensorState = digitalRead(garageSensor1);

  // Print the state to the Serial Monitor
  if (sensorState == HIGH) {
    Serial.println("garageSensor1 is HIGH (not activated)");
  } else {
    Serial.println("garageSensor1 is LOW (activated)");
  }

  // Small delay to prevent flooding the Serial Monitor
  delay(500);
}
