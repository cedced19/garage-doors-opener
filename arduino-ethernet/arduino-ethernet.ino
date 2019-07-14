

#include <SPI.h>
#include <Ethernet.h>

byte mac[] = {
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED
};

#define garageCommand1 2
#define garageSensor1 7

EthernetServer server(80);

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }


  Ethernet.begin(mac);
  server.begin();
  Serial.print("server is at ");
  Serial.println(Ethernet.localIP());

  pinMode(garageSensor1, INPUT);
  pinMode(garageCommand1, OUTPUT);
  digitalWrite(garageCommand1, HIGH);
}


void loop() {
  // listen for incoming clients
  EthernetClient client = server.available();
  if (client) {
    Serial.println();
    Serial.println("new client");
    boolean currentLineIsBlank = true;
    String readString;
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        readString +=c;
        if (c == '\n' && currentLineIsBlank) {
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: application/json");
          client.println("Connection: close");  
          client.println();
          if(readString.indexOf("/garage/1/toggle/oGXabhvW6k ")>0) {
                  Serial.println("toggle");
                  client.println("{\"toggling\":true}");
                  delay(1);
                  client.stop();
                  digitalWrite(garageCommand1, LOW);   
                  delay(1000);                      
                  digitalWrite(garageCommand1, HIGH);
                  break;
          }
          if(readString.indexOf("/garage/1/status/oGXabhvW6k ")>0) {
                  Serial.println("status");
                  if (digitalRead(garageSensor1) == HIGH) {
                    client.println("{\"closed\":true}");
                  } else {
                    client.println("{\"closed\":false}");
                  }
                  delay(1);
                  client.stop();
                  break;
          }
          Serial.println("error");
          client.println("{\"error\":true}");
          delay(1);
          client.stop();
          break;
        }
        
        if (c == '\n') {
          currentLineIsBlank = true;
        } else if (c != '\r') {
          currentLineIsBlank = false;
        }
      }
    }
    Serial.println("client disconnected");
  }
}

