#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager

//for LED status
#include <Ticker.h>
Ticker ticker;

ESP8266WebServer server(80);

#ifndef LED_BUILTIN
#define LED_BUILTIN 13 // ESP32 DOES NOT DEFINE LED_BUILTIN
#endif

int LED = LED_BUILTIN;
void tick() {
  //toggle state
  digitalWrite(LED, !digitalRead(LED));     // set pin to the opposite state
}


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



//gets called when WiFiManager enters configuration mode
void configModeCallback (WiFiManager *myWiFiManager) {
  //Serial.println("Entered config mode");
  //Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  //Serial.println(myWiFiManager->getConfigPortalSSID());
  //entered config mode, make led toggle faster
  ticker.attach(0.2, tick);
}
void openDoor() {
  // Open the relay (set HIGH to activate)
  digitalWrite(garageCommand1, HIGH);
  relayActive = true;                     // Mark the relay as active
  relayStartTime = millis();              // Record the activation time
  Serial.println("Relay is ON");
}

void setup() {
  pinMode(LED, OUTPUT);                   // Set led pin as output
  pinMode(switchPin, INPUT);       // Configure switch pin with pull-down
  pinMode(garageSensor1, INPUT_PULLUP);   // Configure switch pin with pull-up
  pinMode(garageCommand1, OUTPUT);        // Set the relay pin as output
  digitalWrite(garageCommand1, LOW);      // Ensure the relay is initially off

  Serial.begin(115200);
  Serial.println("System ready.");

  WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  
  // start ticker with 0.5 because we start in AP mode and try to connect
  ticker.attach(0.6, tick);
  
  //WiFiManager
  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wm;
  wm.setConfigPortalTimeout(180);
  //reset settings - for testing
  //wm.resetSettings();

  //set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  wm.setAPCallback(configModeCallback);

  //fetches ssid and pass and tries to connect
  //if it does not connect it starts an access point with the specified name
  //here  "AutoConnectAP"
  //and goes into a blocking loop awaiting configuration
  if (!wm.autoConnect()) {
    //Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.restart();
    delay(1000);
  }


  Serial.println("Connected");
  ticker.detach();
  digitalWrite(LED, HIGH); 
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP()); // Print the IP address

  server.on("/garage/1/toggle/oGXabhvW6k", [](){
    server.send(200, "application/json", "{\"toggling\":true}");
    openDoor();
  });

  server.on("/garage/1/status/oGXabhvW6k", [](){
    if (digitalRead(garageSensor1) == HIGH) {
      server.send(200, "application/json", "{\"closed\":false}");
    } else {
      server.send(200, "application/json", "{\"closed\":true}");
    }
  });
  server.begin();
}


void loop() {
  // Read the current state of the switch
  
  unsigned long currentTime = millis();

  int switchState = digitalRead(switchPin);
  
  // Check if the switch is closed and respect the time threshold
  if (currentTime - lastSwitchTime >= switchThreshold) {
    if (switchState == HIGH && !switchPreviouslyClosed) {
      Serial.println("Switch closed, relay will be activated!");
      openDoor();
      lastSwitchTime = currentTime;  // Update the last switch time
    }
    switchPreviouslyClosed = true; // Update the switch state
  }

  // Check if the switch is released (HIGH)
  if (switchState == LOW && switchPreviouslyClosed) {
    switchPreviouslyClosed = false; // Reset the switch state
  }

  // Handle the relay deactivation after the specified duration
  if (relayActive && currentTime - relayStartTime >= relayDuration) {
    digitalWrite(garageCommand1, LOW); // Turn off the relay
    relayActive = false;              // Mark the relay as inactive
    Serial.println("Relay is OFF");
  }
  server.handleClient();
}
