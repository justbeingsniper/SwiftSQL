import typing
if hasattr(typing, '_SpecialForm') and hasattr(typing, 'Optional'):
    try:
        typing.Optional[list]  # Try the problematic call
    except TypeError:
        from typing import _SpecialForm
        def _patched_getitem(self, parameters):
            if not isinstance(parameters, tuple):
                parameters = (parameters,)
            return self._name, parameters
        _SpecialForm.__getitem__ = _patched_getitem


import pickle
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load encoder and decoder models
encoder_model = encoder_model = load_model("models/encoder_model.h5")
decoder_model = load_model("models/decoder_model.h5")

# Load input tokenizer
with open("models/input_tokenizer.pkl", "rb") as f:
    input_tokenizer = pickle.load(f)

# Load target tokenizer
with open("models/target_tokenizer.pkl", "rb") as f:
    target_tokenizer = pickle.load(f)

# Load max lengths
with open("models/Max_lengths.pkl", "rb") as f:
    max_length = pickle.load(f)  # should be a dict: {"input": X, "target": Y}

def predict_sql(nl_query: str) -> str:
    # Convert input text to sequence
    input_seq = input_tokenizer.texts_to_sequences([nl_query])
    input_seq = pad_sequences(input_seq, maxlen=max_length["input"], padding="post")

    # Encode input
    states_value = encoder_model.predict(input_seq)

    # Generate empty target sequence with <start> token
    target_seq = np.zeros((1, 1))
    target_seq[0, 0] = target_tokenizer.word_index['<start>']

    stop_condition = False
    decoded_sentence = ''

    while not stop_condition:
        output_tokens, h, c = decoder_model.predict([target_seq] + states_value)

        # Sample the next word
        sampled_token_index = np.argmax(output_tokens[0, -1, :])
        sampled_word = target_tokenizer.index_word.get(sampled_token_index, '')

        if sampled_word == '<end>' or len(decoded_sentence.split()) > max_length["target"]:
            stop_condition = True
        else:
            decoded_sentence += ' ' + sampled_word

            # Update target sequence and states
            target_seq = np.zeros((1, 1))
            target_seq[0, 0] = sampled_token_index
            states_value = [h, c]

    return decoded_sentence.strip()
