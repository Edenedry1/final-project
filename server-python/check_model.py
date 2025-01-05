import tensorflow as tf

def check_model():
    try:
        model_path = './models/model.h5'  # נתיב למודל
        model = tf.keras.models.load_model(model_path)
        print("✅ Model loaded successfully!")
    except Exception as e:
        print("❌ Error loading model:", e)

if __name__ == "__main__":
    check_model()
