// Define the relay pin
#define garageCommand1 14

void setup() {
  // Set the relay pin as output
  pinMode(garageCommand1, OUTPUT);
  // Ensure the relay is initially off
  digitalWrite(garageCommand1, LOW);

  Serial.begin(115200);
}

void loop() {
  // Open the relay (set HIGH to activate)
  digitalWrite(garageCommand1, HIGH);
  // Keep the relay on for 2 seconds
  delay(200);
  Serial.println("Relay is ON");
  // Turn off the relay (set LOW to deactivate)
  digitalWrite(garageCommand1, LOW);


  delay(10000);
  // Wait indefinitely (or modify this to fit your use case)
  while (true);
}
