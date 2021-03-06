// LED will blink when in config mode
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h> // https://github.com/tzapu/WiFiManager

//for LED status
#include <Ticker.h>
Ticker ticker;

#ifndef LED_BUILTIN
#define LED_BUILTIN 13 // ESP32 DOES NOT DEFINE LED_BUILTIN
#endif

int LED = LED_BUILTIN;

#define garageCommand1 14 // D5
#define garageSensor1 12 // D6
#define garageCommand2 05 // D1
#define garageSensor2 04 // D2
ESP8266WebServer server(80);

void tick()
{
  //toggle state
  digitalWrite(LED, !digitalRead(LED));     // set pin to the opposite state
}

//gets called when WiFiManager enters configuration mode
void configModeCallback (WiFiManager *myWiFiManager) {
  //Serial.println("Entered config mode");
  //Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  //Serial.println(myWiFiManager->getConfigPortalSSID());
  //entered config mode, make led toggle faster
  ticker.attach(0.2, tick);
}

void setup() {
  pinMode(garageSensor1, INPUT);
  pinMode(garageSensor2, INPUT);
  pinMode(garageCommand1, OUTPUT);
  pinMode(garageCommand2, OUTPUT);
  digitalWrite(garageCommand1, HIGH);
  digitalWrite(garageCommand2, HIGH);
  
  WiFi.mode(WIFI_STA); // explicitly set mode, esp defaults to STA+AP
  // put your setup code here, to run once:
  //Serial.begin(115200);
  
  //set led pin as output
  pinMode(LED, OUTPUT);
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

  //if you get here you have connected to the WiFi
  //Serial.println("connected...yeey :)");
  ticker.detach();
  //keep LED off
  digitalWrite(LED, HIGH);

  WiFi.setSleepMode(WIFI_NONE_SLEEP);

  server.on("/garage/1/toggle/oGXabhvW6k", [](){
    server.send(200, "application/json", "{\"toggling\":true}");
    digitalWrite(garageCommand1, LOW);   
    delay(1000);                      
    digitalWrite(garageCommand1, HIGH);
  });

  server.on("/garage/2/toggle/oGXabhvW6k", [](){
    server.send(200, "application/json", "{\"toggling\":true}");
    digitalWrite(garageCommand2, LOW);   
    delay(1000);                      
    digitalWrite(garageCommand2, HIGH);
  });

  server.on("/garage/1/status/oGXabhvW6k", [](){
    if (digitalRead(garageSensor1) == HIGH) {
      server.send(200, "application/json", "{\"closed\":true}");
    } else {
      server.send(200, "application/json", "{\"closed\":false}");
    }
  });

  server.on("/garage/2/status/oGXabhvW6k", [](){
    if (digitalRead(garageSensor2) == HIGH) {
      server.send(200, "application/json", "{\"closed\":true}");
    } else {
      server.send(200, "application/json", "{\"closed\":false}");
    }
  });
  server.begin();
}

void loop() {
  server.handleClient();
}
