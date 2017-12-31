#include <SoftwareSerial.h>

SoftwareSerial mySerial(10, 11); // TX, RX

#define garage1 2
#define garage2 3

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  
  mySerial.begin(115200);

  pinMode(garage1, OUTPUT);
  pinMode(garage2, OUTPUT);
  digitalWrite(garage1, HIGH);
  digitalWrite(garage2, HIGH);
}



void loop() { // run over and over
  if (mySerial.available()) {
    int c = mySerial.read();
    Serial.write(c);
    if (c == 10) {
      digitalWrite(garage1, LOW);   
      delay(1000);                      
      digitalWrite(garage1, HIGH);
    } else if (c == 20) {
      digitalWrite(garage2, LOW);   
      delay(1000);                      
      digitalWrite(garage2, HIGH);
    }
  }
}
