#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>

const char* ssid = "wifi_name"; // wifi SSID
const char* password = "wifi_pwd";// wifi password
#define garageCommand1 05 // D1
#define garageSensor1 14 // D5
ESP8266WebServer server(80);

void setup(void){
  pinMode(2, OUTPUT); 
  delay(2000);
  pinMode(garageSensor1, INPUT);
  pinMode(garageCommand1, OUTPUT);
  digitalWrite(garageCommand1, HIGH);

  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    digitalWrite(2, LOW);
    delay(1000);
  }
  digitalWrite(2, HIGH); 
  WiFi.mode(WIFI_STA);


  server.on("/garage/1/toggle/4czODA", [](){
    server.send(200, "application/json", "{\"toggling\":true}");
    digitalWrite(garageCommand1, LOW);   
    delay(1000);                      
    digitalWrite(garageCommand1, HIGH);
  });

  server.on("/garage/1/status/4czODA", [](){
    if (digitalRead(garageSensor1) == HIGH) {
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
