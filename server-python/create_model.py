import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# יצירת מודל פשוט לדוגמה
def create_model():
    model = Sequential([
        Dense(128, activation='relu', input_shape=(13,)),
        Dense(64, activation='relu'),
        Dense(1, activation='sigmoid'),
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# שמירת המודל
model = create_model()
model.save('./models/model.h5')
print("✅ Model saved successfully!")
