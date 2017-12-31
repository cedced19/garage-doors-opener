#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
const char* ssid = "claire"; // wifi SSID
const char* password = "26afaf2004";// wifi password
ESP8266WebServer server(80); 
void setup(void){
  Serial.begin(115200); // Define bauds of the ESP8266

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  //Serial.println(WiFi.localIP());

  server.on("/garage/1/toggle", [](){
    server.send(200, "text/plain", "{\"toggling\":true}");
    Serial.println("10");
  });

  server.on("/garage/2/toggle", [](){
    server.send(200, "text/plain", "{\"toggling\":true}");
    Serial.println("20");
  });

  server.on("/garage/1/status", [](){
    server.send(200, "text/plain", "Getting status garage number 1");
  });
  
  
  server.begin();
}
void loop(void){
  server.handleClient();
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
    }
  }
}
