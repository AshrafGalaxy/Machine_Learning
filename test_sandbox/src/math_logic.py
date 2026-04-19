import math
# SYNTAX ERROR below
def add_numbers(a, b)
    return a + b

def subtract(a, b):
    # LOGIC ERROR below (wrong operator)
    return a + b

def convert_to_int(val):
    # TYPE ERROR below (can't add float to string without converting)
    return float(val) + "1"
