import pytest
from src.parser import process_data

def test_process_data():
    assert process_data("a") == "aa"
