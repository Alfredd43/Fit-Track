from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import openai
import json
import secrets
load_dotenv()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
CORS(app)

@app.route('/')
def index():
    # Initialize OpenAI client
    openai.api_key = os.getenv("OPENAI_API_KEY")
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    

    return "Fitness Bab Backend Running!"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.name}', '{self.email}')"

class ExerciseLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise_type = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    intensity = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('exercise_logs', lazy=True))

class FoodLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    food_item = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50))
    calories = db.Column(db.Integer)
    macros = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('food_logs', lazy=True))

class WaterLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    volume = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('water_logs', lazy=True))

class AIInteraction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_message = db.Column(db.String(500), nullable=False)
    ai_reply = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('ai_interactions', lazy=True))

tokens = {} # In-memory storage for tokens

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token or token not in tokens:
            return jsonify({'message': 'Token is missing or invalid!'}), 401
        kwargs['user_id'] = tokens[token]
        return f(*args, **kwargs)


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'})

@app.route('/login', methods=['POST'])
def login():
    from functools import wraps
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({'message': 'Invalid credentials!'}), 401

    if check_password_hash(user.password, data['password']):
        # TODO: Implement token generation
        return jsonify({'message': 'Login successful!'})
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401


@app.route('/log/food', methods=['POST'])
@token_required
def add_food_log():
    data = request.get_json()
    from functools import wraps
    user_id = data['user_id']
    food_item = data['food_item']

    nutrition_info = extract_nutrition_info(food_item)

    calories = nutrition_info.get('calories')
    macros_dict = {
        'protein': nutrition_info.get('protein'),
        'carbs': nutrition_info.get('carbs'),
        'fats': nutrition_info.get('fats')
    }
    macros = json.dumps(macros_dict) if any(macros_dict.values()) else None

    new_food_log = FoodLog(user_id=user_id, food_item=food_item, calories=calories, macros=macros)
    db.session.add(new_food_log)
db.session.commit()

 return jsonify({'message': 'Food log added successfully!', 'nutrition_info': nutrition_info})


@app.route('/log/water', methods=['POST'])
def add_water_log():
@token_required
def add_water_log():
    data = request.get_json()
    user_id = data['user_id']
    volume = data['volume']

    new_water_log = WaterLog(user_id=user_id, volume=volume)
    db.session.add(new_water_log)
    db.session.commit()

    return jsonify({'message': 'Water log added successfully!'})

@app.route('/log/exercise', methods=['POST'])
@token_required
def add_exercise_log():
    data = request.get_json()
    user_id = data['user_id']
    exercise_type = data['exercise_type']
    duration = data['duration']
    intensity = data.get('intensity') # Intensity is optional

    new_exercise_log = ExerciseLog(user_id=user_id, exercise_type=exercise_type, duration=duration, intensity=intensity)
    db.session.add(new_exercise_log)
    db.session.commit()

    return jsonify({'message': 'Exercise log added successfully!'})

@app.route('/logs', methods=['GET'])
@token_required
def get_logs():
    user_id = request.args.get('user_id') # Get user_id from query parameters
    food_logs = FoodLog.query.filter_by(user_id=user_id).all()
    water_logs = WaterLog.query.filter_by(user_id=user_id).all()
    exercise_logs = ExerciseLog.query.filter_by(user_id=user_id).all()

    # TODO: Format logs for JSON response
    food_logs_list = [{'food_item': log.food_item, 'quantity': log.quantity, 'calories': log.calories, 'macros': json.loads(log.macros) if log.macros else None, 'timestamp': log.timestamp.isoformat()} for log in food_logs]
    water_logs_list = [{'volume': log.volume, 'timestamp': log.timestamp.isoformat()} for log in water_logs]
    exercise_logs_list = [{'exercise_type': log.exercise_type, 'duration': log.duration, 'intensity': log.intensity, 'timestamp': log.timestamp.isoformat()} for log in exercise_logs]

    return jsonify({'food_logs': food_logs_list, 'water_logs': water_logs_list, 'exercise_logs': exercise_logs_list})

def extract_nutrition_info(food_item):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Extract calorie and macro information (protein, carbs, fats) from the following food item description and return it as a JSON object. If information is not available, use null. Example: {'calories': 200, 'protein': 10, 'carbs': 20, 'fats': 5}"},
                {"role": "user", "content": food_item}
            ]
        )
        nutrition_text = response.choices[0].message['content'].strip()
        return json.loads(nutrition_text)
    except Exception as e:
        print(f"Error extracting nutrition info: {e}")
        return {} # Return an empty dictionary in case of error


@app.route('/chat', methods=['POST'])
@token_required
def chat_with_ai():
    data = request.get_json()
    user_id = data['user_id']
    user_message = data['user_message']

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", # Or your preferred GPT model
            messages=[
                {"role": "system", "content": "You are a helpful wellness coach."},
                {"role": "user", "content": user_message}
            ]
        )
        ai_reply = response.choices[0].message['content'].strip()

        new_interaction = AIInteraction(user_id=user_id, user_message=user_message, ai_reply=ai_reply)
        db.session.add(new_interaction)
        db.session.commit()

        return jsonify({'ai_reply': ai_reply})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat/history', methods=['GET'])
@token_required
def get_chat_history():
    user_id = request.args.get('user_id')
    chat_history = AIInteraction.query.filter_by(user_id=user_id).order_by(AIInteraction.timestamp).all()

    # Format chat history for JSON response
    history_list = [{'user_message': interaction.user_message, 'ai_reply': interaction.ai_reply, 'timestamp': interaction.timestamp.isoformat()} for interaction in chat_history]
    return jsonify({'chat_history': history_list})

if __name__ == '__main__':
    app.run(debug=True)