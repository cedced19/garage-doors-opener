// Define the relay pin
#define garageCommand1 14 // D5
#define garageSensor1 12 // D6
#define switchPin 4       // D2 (to be connected to the ground)

// State variables
bool relayActive = false;            // Indicates whether the relay is currently active
unsigned long relayStartTime = 0;    // Records the time when the relay was activated
const unsigned long relayDuration = 200;      // Duration to keep the relay ON (in ms)

bool switchPreviouslyClosed = false; // Tracks the previous state of the switch
unsigned long lastSwitchTime = 0;    // Time when the switch was last checked
const unsigned long switchThreshold = 2000;    // Time threshold between two switch checks (in ms)

void setup() {
  pinMode(switchPin, INPUT_PULLUP);       // Configure switch pin with pull-up
  pinMode(garageCommand1, OUTPUT);        // Set the relay pin as output
  digitalWrite(garageCommand1, LOW);      // Ensure the relay is initially off

  Serial.begin(115200);
  Serial.println("System ready.");
}

void openDoor() {
  // Open the relay (set HIGH to activate)
  digitalWrite(garageCommand1, HIGH);
  relayActive = true;                     // Mark the relay as active
  relayStartTime = millis();              // Record the activation time
  Serial.println("Relay is ON");
}

void loop() {
  // Read the current state of the switch
  
  unsigned long currentTime = millis();

  int switchState = digitalRead(switchPin);
  
  // Check if the switch is closed and respect the time threshold
  if (currentTime - lastSwitchTime >= switchThreshold) {
    if (switchState == LOW && !switchPreviouslyClosed) {
      Serial.println("Switch closed, relay will be activated!");
      openDoor();
      lastSwitchTime = currentTime;  // Update the last switch time
    }
    switchPreviouslyClosed = true; // Update the switch state
  }

  // Check if the switch is released (HIGH)
  if (switchState == HIGH && switchPreviouslyClosed) {
    switchPreviouslyClosed = false; // Reset the switch state
  }

  // Handle the relay deactivation after the specified duration
  if (relayActive && currentTime - relayStartTime >= relayDuration) {
    digitalWrite(garageCommand1, LOW); // Turn off the relay
    relayActive = false;              // Mark the relay as inactive
    Serial.println("Relay is OFF");
  }

}
