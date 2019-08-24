# raspberry

You can also use a Raspberry Pi to open a door. All you need is to install `pip` and `pipenv`.

```
sudo pipenv install
sudo pipenv run python3 index.py
```

You have to connect the sensor to the GPIO11 and the relay to the GPIO17 

![Raspberry Pi GPIO](raspberry-GPIO.jpg)


## Use RasAP

If you want to use RasAP to create a hotspot in your garage for example, take care of those informations (true for Raspberry Pi 3B):

### You have to set power save off 

[Make “iw wlan0 set power_save off” permanent.](https://raspberrypi.stackexchange.com/questions/96606/make-iw-wlan0-set-power-save-off-permanent)

### Edit `hostapd` config

Add those lines in the `/etc/hostapd/hostapd.conf` file
```
wpa_pairwise=TKIP
wpa_key_mgmt=WPA-PSK
```