from app.model import detect_errors

def test_returns_dict():
    result = detect_errors("mag-kain siya")
    assert isinstance(result, dict)

def test_has_original_field():
    result = detect_errors("mag-kain siya")
    assert "original" in result

def test_has_corrected_field():
    result = detect_errors("mag-kain siya")
    assert "corrected" in result

def test_original_matches_input():
    result = detect_errors("test input")
    assert result["original"] == "test input"

def test_no_crash_on_taglish():
    result = detect_errors("I love kain ng rice")
    assert result is not None
