from waitress import serve
from flask import Flask, jsonify

app = Flask(__name__)

import RPi.GPIO as GPIO
import time


toggle_pin = 17
status_pin = 11


@app.route('/garage/1/toggle/j0ugKdDQ4')
def toggle():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(toggle_pin, GPIO.OUT)
    GPIO.output(toggle_pin, False)
    time.sleep(1)
    GPIO.output(toggle_pin, True)
    GPIO.cleanup()
    message = {'toggling':True}
    return jsonify(message)

@app.route('/garage/1/status/j0ugKdDQ4')
def status():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(status_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    message = {'closed': (True if (GPIO.input(status_pin) == 1) else False)}
    return jsonify(message)


serve(app, host='0.0.0.0', port=8867)