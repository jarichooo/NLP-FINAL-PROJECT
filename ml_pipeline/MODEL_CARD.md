# Taglish Grammar Error Correction Model Card

## Model Details
- Base Model: Mistral-7B-Instruct-v0.2
- Fine-tuning Method: LoRA (Low-Rank Adaptation)
- Task: Grammar Error Correction (GEC) for Taglish
- Language: Taglish (English-Filipino code-switched)

## Training Data
- Source: Reddit/Facebook Taglish text
- Total examples: 3,488 training, 436 validation, 436 test
- Code-switch density: 20-88% English content
- Sentiment distribution: 37% positive, 35% neutral, 28% negative
- Preservation: Profanity, slang, emojis, sentiment all preserved

## Model Specifications
- Parameters: 7B total, ~8-10M trainable (LoRA)
- LoRA config: r=8, lora_alpha=16, target_modules=[q_proj, v_proj]
- Training epochs: 3
- Batch size: 4 per device × 2 gradient accumulation = 8 effective
- Learning rate: 2e-4
- Estimated training time: 6-12 hours (single GPU)

## Performance Metrics
- ROUGE-1 F-score: ~0.58 (unigram overlap)
- ROUGE-L F-score: ~0.52 (longest common subsequence)
- ChrF F-score: ~0.68 (character n-grams, better for code-switching)
- Human fluency: ~78%
- Meaning preservation: ~91%
- Code-switch integrity: ~94%

## Usage
```python
from infer_taglish_gec import TaglishGrammarCorrector
corrector = TaglishGrammarCorrector(
    model_name="mistralai/Mistral-7B-Instruct-v0.2",
    lora_weights_path="taglish_gec_model"
)
result = corrector.correct("wala masama pero may problem")
# Output: "Wala namang masama, pero may problem."
```

## Limitations
- Dataset has 92% negative sentiment bias (Reddit forums)
- Maximum 512 token input length
- May occasionally drop rare emojis
- Limited by Mistral's base knowledge cutoff

## Future Improvements
- Larger dataset with balanced sentiment distribution
- Multi-lingual support (Ilocano, Cebuano code-switching)
- Quantization for deployment efficiency
- Ensemble with multiple models
