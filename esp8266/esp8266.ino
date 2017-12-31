#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
const char* ssid = "claire"; // wifi SSID
const char* password = "26afaf2004";// wifi password
#define garage1 0
#define garage2 2
ESP8266WebServer server(80);
MDNSResponder mdns;
void setup(void){
  pinMode(garage1, INPUT);
  pinMode(garage2, INPUT);
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }


  server.on("/garage/1/toggle/oGXabhvW6k", [](){
    server.send(200, "application/json", "{\"toggling\":true}");
    Serial.println('1');
  });

  server.on("/garage/2/toggle/oGXabhvW6k", [](){
    server.send(200, "application/json", "{\"toggling\":true}");
    Serial.println('2');
  });

  server.on("/garage/1/status/oGXabhvW6k", [](){
    if (digitalRead(garage1) == HIGH) {
      server.send(200, "application/json", "{\"closed\":true}");
    } else {
      server.send(200, "application/json", "{\"closed\":false}");
    }
    
  });

  server.on("/garage/2/status/oGXabhvW6k", [](){
    if (digitalRead(garage2) == HIGH) {
      server.send(200, "application/json", "{\"closed\":true}");
    } else {
      server.send(200, "application/json", "{\"closed\":false}");
    }
    
  });
  
  server.begin();
}
void loop(void){
  server.handleClient();
}
