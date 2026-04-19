import pytest
from src.math_logic import add_numbers, subtract, convert_to_int

def test_add_numbers():
    assert add_numbers(2, 3) == 5

def test_subtract():
    assert subtract(10, 5) == 5

def test_convert_to_int():
    assert convert_to_int("20") == 21.0
