#include <SoftwareSerial.h>

SoftwareSerial mySerial(10, 11); // TX, RX

#define garage1 2
#define garage2 3

void setup() {
  mySerial.begin(9600);

  pinMode(garage1, OUTPUT);
  pinMode(garage2, OUTPUT);
  digitalWrite(garage1, HIGH);
  digitalWrite(garage2, HIGH);
}



void loop() { // run over and over
  if (mySerial.available()) {
    int c = mySerial.read();
    if (c == '1') {
      digitalWrite(garage1, LOW);   
      delay(1000);                      
      digitalWrite(garage1, HIGH);
    } else if (c == '2') {
      digitalWrite(garage2, LOW);   
      delay(1000);                      
      digitalWrite(garage2, HIGH);
    }
  }
}