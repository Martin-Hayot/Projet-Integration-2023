def non_inverting_amplifier(Ve, R1, R2):
    return Ve * (1 + (R2 / R1))


input_values = []
for i in range(-5, 5, 1):
    input_values.append(i / 10)
R1 = 100
R2 = 10000
print(f"R1 = {R1} ohms")
print(f"R2 = {R2} ohms")
for vs in input_values:
    print(vs)
    print(f"non-inverting : {non_inverting_amplifier(vs, R1, R2):.2f}")
    print("###########################")
