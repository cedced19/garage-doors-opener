#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

const char* ssid = "wifi_name"; // wifi SSID
const char* password = "wifi_pwd";// wifi password
#define garageCommand1 14 // D5
#define garageSensor1 12 // D6
#define garageCommand2 13 // D7
#define garageSensor2 15 // D8
ESP8266WebServer server(80);

void setup(void){
  pinMode(garageSensor1, INPUT);
  pinMode(garageSensor2, INPUT);
  pinMode(garageCommand1, OUTPUT);
  pinMode(garageCommand2, OUTPUT);
  digitalWrite(garageCommand1, HIGH);
  digitalWrite(garageCommand2, HIGH);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  WiFi.mode(WIFI_STA);


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
void loop(void){
  server.handleClient();
}
