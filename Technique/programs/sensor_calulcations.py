from typing import Final
import random
from time import sleep
import sys


def inverting_amplifier(Ve, R1, R2):
    return -Ve * (R2 / R1)


INPUT_VOLTAGES: Final[list] = [-0.5, 0.5]
KNOWN_RESISTORS: Final[list] = [40]

sensor_resistance = 0

try:
    for i, resistor in enumerate(KNOWN_RESISTORS):
        with open(
            f"./programs/data/resistances/sensor_resistance_{resistor}.txt", "w"
        ) as f:
            f.write(f"Sensor resistance (ohms)")
            for i in range(len(INPUT_VOLTAGES)):
                f.write(f" | {INPUT_VOLTAGES[i]} ({i}) (V)")
                f.write(f" | Output ({i}) (V)")
            f.write("\n")
            for i in range(10, 401):
                sensor_resistance = i
                f.write(f"{sensor_resistance}")
                for i, voltage in enumerate(INPUT_VOLTAGES):
                    f.write(f" | {voltage}")
                    f.write(
                        f" | {inverting_amplifier(voltage, resistor, sensor_resistance):.2f}"
                    )
                f.write("\n")
        print(f"{i} ({resistor}) done")

except KeyboardInterrupt:
    print("Exiting...")
    sys.exit(0)
