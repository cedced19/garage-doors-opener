# garage-doors-opener
An application to open my garage doors with an Arduino system through internet.

* [Youtube video](https://www.youtube.com/watch?v=6a8xaTq5VHo)
* [Download application](https://play.google.com/store/apps/details?id=com.garagedoorsopener)

![First system](schema1.png)

**I strongly recommand to use a proxy server, like [caddy](https://caddyserver.com/), to have a safe connection thanks HTTPS.**

**Materials you will need for two doors**
* 1 Arduino Uno *10€*
* 1 ESP8266-01 *5€*
* Some jumber wire *6€ for 140*
* 2 220 resistor *5€ for 10*
* 2 Magnetic switch *8€ for 5*
* 1 4 Channel Module Relay *6€*


Total: **37€**

To reproduce my system you need to know how to upload code to the ESP8266 and to the Arduino Uno.

If you are able to code, you don't have to use an Arduino Uno, you only need to use an ESP8266-12.

To use the application you have to use URLs like where `oGXabhvW6k` is the password and `1` the number:
* `/garage/1/toggle/oGXabhvW6k` to toggle a door
* `/garage/1/status/oGXabhvW6k` to get the status of the door

## Conversations

**I had some conversation with people who wanted to use my app, if you have a question, you may need to read that**

There are  three folder on Github :
You need to put the arduino.ino code to the Arduino, the esp8266.ino code to the ESP8266. (it's not easy to do this step)
Before doing this update the wifi ssid and the wifi pwd in the esp8266.ino file for your case.

Then you just have to connect all the things together.

You need a ESP8266 to have connection to internet
The ESP8266 is connected to the Arduino with TX/RX as you can see on the schema. It send a message when there is a request to toggle the door.

The ESP8266 is also connected to the breadboard, there is a system with resistor etc.. With those connections the ESP8266 can detect if the door is closed or not

In the address field of the App you have to set the IP of your ESP8266, you can get it on your router.  Set "http://192.168.0.4" for example.
With this it will only work when you are using the same network.
If you are outside of the house, and have no wifi for example, it will not work.
To get this to work you will have to redirect port and you will be able to use your "global IP".

GPIO is basically a pin of the ESP8266.

You should know that the GPIO0 of the ESP8266 should NOT be on the ground on start.

If it is on the ground on start it will not load the schematic you loaded. It will wait for data and new schematic.

That's the complicated part, when you want to send code to your ESP8266 the GPIO0 have to be on the ground.

To send code to the ESP8266, you will have to use the Arduino since there is no USB port on the ESP8266.
I don't have the time yet to explain you how but I'll if you can't.

I used this blog post to know how to do send code to the ESP8266:  
[http://ouilogique.com/ESP8266-01/](http://ouilogique.com/ESP8266-01/)
It's in french but I will search for a english version.

There are different manufacturers of the ESP8266-01, and so there is little differences:
*the bauds may be different (see in the code for what you want, normally the will be no problem)
*the RX/TX connector may be inversed

## System with NodeMCU

The first system is not perfect, because you have to use an Arduino and an ESP8266-01. I saw afterwards that I can do the system with a ESP8266-12 which have more GPIO
Instead of an Arduino and an ESP8266-01, I use now an NodeMCU Lua Lolin V3 Module.

![System with NodeMCU](schema2.png)


## System with Arduino and Ethernet Shield

If you want to use a ethernet cable yon can also do it with the file `arduino-ethernet.ino` file

![System with Arduino and Ethernet Shield](schema3.png)

## System with Raspberry Pi

It is quite the same as the system with Arduino and Ethernet Shield.
