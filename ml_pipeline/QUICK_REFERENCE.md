# Taglish Grammar Correction - Quick Reference

## Installation
```bash
pip install torch transformers peft datasets rouge
```

## Training
```bash
# Notebook
jupyter notebook taglish_grammar_correction.ipynb
# Execute cells 1-8 in order

# OR Standalone script
python train_taglish_gec.py --epochs 3 --batch-size 4
```

## Inference
```bash
# Single sentence
python infer_taglish_gec.py "wala masama pero may problem"

# Batch from file
python infer_taglish_gec.py --input-file input.txt --output-file output.txt

# Interactive
python infer_taglish_gec.py --interactive
```

## API Usage
```python
corrector = TaglishGrammarCorrector(
    model_name="mistralai/Mistral-7B-Instruct-v0.2",
    lora_weights_path="taglish_gec_model"
)

# Single
text = "wala masama pero may problem"
corrected = corrector.correct(text, temperature=0.5)

# Batch
texts = ["text1", "text2", "text3"]
corrected = corrector.batch_correct(texts)
```

## Expected Results
- Training: ~6-12 hours per 3 epochs
- ROUGE-1: ~0.58
- ROUGE-L: ~0.52
- ChrF: ~0.68
- Inference: ~0.8 sec per sentence

## Troubleshooting
- Out of memory: Reduce batch size or enable int8
- Slow: Check GPU with nvidia-smi
- Missing emojis: Post-process restore
- Over-translation: Lower temperature to 0.3-0.5
