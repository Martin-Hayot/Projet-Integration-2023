import requests
import random
import time
import RPi.GPIO as GPIO

# Pins definitions
btn_pin = 4
led_pin = 12

# Set up pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(btn_pin, GPIO.IN)
GPIO.setup(led_pin, GPIO.OUT)

# If button is pushed, light up LED
try:
    while True:
        time.sleep(0.1)
        if GPIO.input(btn_pin):
            GPIO.output(led_pin, GPIO.LOW)
            print("non")
        else:
            GPIO.output(led_pin, GPIO.HIGH)
            print("oui")
            nb_aleatoire = random.randrange(20, 300, 1)
            r = requests.post(
                'http://51.68.172.36:3000/addDataAquarium', json={"data": nb_aleatoire})
            print(r.status_code, r.json())

# When you press ctrl+c, this will be called
finally:
    GPIO.cleanup()
