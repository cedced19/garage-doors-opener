// Define the relay pin
#define garageCommand1 14 // D5
#define switchPin 04 // D2 (to be connected to the ground)

void setup() {

  pinMode(switchPin, INPUT_PULLUP);
  
  // Set the relay pin as output
  pinMode(garageCommand1, OUTPUT);
  // Ensure the relay is initially off
  digitalWrite(garageCommand1, LOW);

  Serial.begin(115200);
  Serial.println("System ready.");
}

void openDoor() {
  // Open the relay (set HIGH to activate)
  digitalWrite(garageCommand1, HIGH);
  // Keep the relay on for 2 seconds
  delay(200);
  Serial.println("Relay is ON");
  // Turn off the relay (set LOW to deactivate)
  digitalWrite(garageCommand1, LOW);
}

void loop() {
  int switchState = digitalRead(switchPin);

  // If switch is closed, then activate relay
  if (switchState == HIGH) {
    Serial.println("Switch closed, relay activated!");
    
    delay(1000);
    
    // Wait for switch to be released (avoid multiple activations)
    while (digitalRead(switchPin) == HIGH) {
      delay(1000); // Short wait to avoid a blocking loop
    }
    openDoor();
    Serial.println("Listen to switch");
  }
}
