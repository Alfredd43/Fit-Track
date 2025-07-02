from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
import openai
import json
import secrets
from functools import wraps
import google.generativeai as genai
import cohere

load_dotenv()
COHERE_API_KEY = os.environ.get('COHERE_API_KEY')
cohere_client = cohere.Client(COHERE_API_KEY) if COHERE_API_KEY else None

app = Flask(__name__)

# --- AWS RDS/Cloud DB Support ---
# Set AWS_RDS_URI in your .env for production, fallback to SQLite for local dev
aws_rds_uri = os.environ.get('AWS_RDS_URI')
if aws_rds_uri:
    app.config['SQLALCHEMY_DATABASE_URI'] = aws_rds_uri
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# --- End AWS RDS/Cloud DB Support ---

db = SQLAlchemy(app)
CORS(app, supports_credentials=True)

@app.route('/')
def index():
    return "Fitness Bab Backend Running!"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    streak = db.Column(db.Integer, default=0)
    goals = db.Column(db.String(50), default='0/0')
    wellness = db.Column(db.Integer, default=0)
    level = db.Column(db.String(50), default='Beginner')

    def __repr__(self):
        return f"User('{self.name}', '{self.email}')"

class ExerciseLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise_type = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    intensity = db.Column(db.String(50))
    calories_burnt = db.Column(db.Integer, default=0)
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

    return decorated # This return was missing

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401

    token = secrets.token_hex(16)
    tokens[token] = user.id
    return jsonify({
        'token': token,
        'user_id': user.id,
        'name': user.name,
        'streak': user.streak,
        'goals': user.goals,
        'wellness': user.wellness,
        'level': user.level
    })

# Local fallback nutrition database for common foods
LOCAL_NUTRITION_DB = {
    # Fruits
    "apple": {"calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3},
    "banana": {"calories": 105, "protein": 1.3, "carbs": 27, "fat": 0.3},
    "orange": {"calories": 62, "protein": 1.2, "carbs": 15.4, "fat": 0.2},
    "grapes": {"calories": 62, "protein": 0.6, "carbs": 16, "fat": 0.3},
    "strawberry": {"calories": 4, "protein": 0.1, "carbs": 0.9, "fat": 0.0},
    "watermelon": {"calories": 46, "protein": 0.9, "carbs": 11.5, "fat": 0.2},
    # Vegetables
    "carrot": {"calories": 25, "protein": 0.6, "carbs": 6, "fat": 0.1},
    "broccoli": {"calories": 55, "protein": 3.7, "carbs": 11.2, "fat": 0.6},
    "potato": {"calories": 161, "protein": 4.3, "carbs": 37, "fat": 0.2},
    "spinach": {"calories": 7, "protein": 0.9, "carbs": 1.1, "fat": 0.1},
    # Grains & Starches
    "rice": {"calories": 206, "protein": 4.2, "carbs": 45, "fat": 0.4},
    "bread": {"calories": 80, "protein": 2.7, "carbs": 15, "fat": 1},
    "pasta": {"calories": 200, "protein": 7, "carbs": 42, "fat": 1.2},
    "oatmeal": {"calories": 150, "protein": 5, "carbs": 27, "fat": 2.5},
    # Protein/Meat
    "chicken breast": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "beef": {"calories": 250, "protein": 26, "carbs": 0, "fat": 17},
    "egg": {"calories": 78, "protein": 6, "carbs": 0.6, "fat": 5},
    "fish": {"calories": 120, "protein": 22, "carbs": 0, "fat": 2.5},
    "tofu": {"calories": 76, "protein": 8, "carbs": 1.9, "fat": 4.8},
    # Dairy
    "milk": {"calories": 103, "protein": 8, "carbs": 12, "fat": 2.4},
    "cheese": {"calories": 113, "protein": 7, "carbs": 0.4, "fat": 9},
    "yogurt": {"calories": 59, "protein": 10, "carbs": 3.6, "fat": 0.4},
    # Snacks
    "chips": {"calories": 152, "protein": 2, "carbs": 15, "fat": 10},
    "chocolate": {"calories": 210, "protein": 2, "carbs": 24, "fat": 13},
    "cookie": {"calories": 50, "protein": 0.6, "carbs": 7, "fat": 2.2},
    # Drinks
    "soda": {"calories": 150, "protein": 0, "carbs": 39, "fat": 0},
    "juice": {"calories": 110, "protein": 1.7, "carbs": 26, "fat": 0.3},
    # Misc
    "pizza": {"calories": 285, "protein": 12, "carbs": 36, "fat": 10},
    "burger": {"calories": 354, "protein": 17, "carbs": 29, "fat": 17},
    "salad": {"calories": 33, "protein": 2, "carbs": 6, "fat": 0.4},
    "soup": {"calories": 72, "protein": 3, "carbs": 12, "fat": 1.5},
}

def local_nutrition_lookup(food_name):
    food = food_name.lower().strip()
    for key in LOCAL_NUTRITION_DB:
        if key in food:
            return LOCAL_NUTRITION_DB[key]
    # Default fallback
    return {"calories": 100, "protein": 2, "carbs": 15, "fat": 1}

@app.route('/log/food', methods=['POST'])
@token_required
def log_food(user_id):
    data = request.get_json()
    food_item = data.get('food_item')

    if not food_item:
        return jsonify({'message': 'Food item is required'}), 400

    nutrition_info = extract_nutrition_info(food_item)

    # Fallback: use local nutrition lookup
    nutrition = local_nutrition_lookup(food_item)

    new_food_log = FoodLog(
        user_id=user_id,
        food_item=food_item,
        calories=nutrition.get('calories'),
        macros=json.dumps({k: v for k, v in nutrition.items() if k != 'calories'})
    )
    db.session.add(new_food_log)
    db.session.commit()

    return jsonify({'message': 'Food log added successfully!', 'nutrition_info': nutrition_info})

@app.route('/log/water', methods=['POST'])
@token_required
def add_water_log(user_id):
    data = request.get_json()
    volume = data['volume']

    new_water_log = WaterLog(user_id=user_id, volume=volume)
    db.session.add(new_water_log)
    db.session.commit()

    return jsonify({'message': 'Water log added successfully!'})

@app.route('/log/exercise', methods=['POST'])
@token_required
def add_exercise_log(user_id):
    data = request.get_json()
    exercise_type = data['exercise_type']
    duration = data['duration']
    intensity = data.get('intensity') # Intensity is optional

    # Simple calories burnt calculation
    intensity_factor = {'low': 4, 'moderate': 7, 'high': 10}
    factor = intensity_factor.get(intensity, 5)
    calories_burnt = int(duration) * factor

    new_exercise_log = ExerciseLog(user_id=user_id, exercise_type=exercise_type, duration=duration, intensity=intensity, calories_burnt=calories_burnt)
    db.session.add(new_exercise_log)
    db.session.commit()

    return jsonify({'message': 'Exercise log added successfully!', 'calories_burnt': calories_burnt})

@app.route('/logs', methods=['GET'])
@token_required
def get_logs(user_id):
    today = date.today()
    food_logs = FoodLog.query.filter_by(user_id=user_id).filter(db.func.date(FoodLog.timestamp) == today).all()
    water_logs = WaterLog.query.filter_by(user_id=user_id).filter(db.func.date(WaterLog.timestamp) == today).all()
    exercise_logs = ExerciseLog.query.filter_by(user_id=user_id).filter(db.func.date(ExerciseLog.timestamp) == today).all()

    food_logs_list = [{'food_item': log.food_item, 'quantity': log.quantity, 'calories': log.calories, 'macros': json.loads(log.macros) if log.macros else None, 'timestamp': log.timestamp.isoformat()} for log in food_logs]
    water_logs_list = [{'volume': log.volume, 'timestamp': log.timestamp.isoformat()} for log in water_logs]
    exercise_logs_list = [{'exercise_type': log.exercise_type, 'duration': log.duration, 'intensity': log.intensity, 'calories_burnt': log.calories_burnt, 'timestamp': log.timestamp.isoformat()} for log in exercise_logs]

    total_calories = sum(log.calories or 0 for log in food_logs)
    total_water = sum(log.volume or 0 for log in water_logs)
    total_calories_burnt = sum(log.calories_burnt or 0 for log in exercise_logs)

    return jsonify({
        'food_logs': food_logs_list,
        'water_logs': water_logs_list,
        'exercise_logs': exercise_logs_list,
        'total_calories': total_calories,
        'total_water': total_water,
        'total_calories_burnt': total_calories_burnt
    })

def extract_nutrition_info(food_item):
    concise_instruction = "Respond in 2 sentences or less. Be concise and to the point."
    # Try Cohere first
    if cohere_client:
        try:
            prompt = f"Extract calorie and macro information (protein, carbs, fats) from the following food item description and return it as a JSON object. {concise_instruction} If information is not available, use null. Example: {{'calories': 200, 'protein': 10, 'carbs': 20, 'fat': 5}}\nFood: {food_item}"
            response = cohere_client.generate(
                model="command-r-plus",
                prompt=prompt,
                max_tokens=100,
                temperature=0.2
            )
            nutrition_text = response.generations[0].text.strip()
            return json.loads(nutrition_text)
        except Exception as ce:
            print(f"Cohere nutrition info failed: {ce}")
    # Try OpenAI next
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"Extract calorie and macro information (protein, carbs, fats) from the following food item description and return it as a JSON object. {concise_instruction} If information is not available, use null. Example: {{'calories': 200, 'protein': 10, 'carbs': 20, 'fat': 5}}"},
                {"role": "user", "content": food_item}
            ]
        )
        nutrition_text = response.choices[0].message['content'].strip()
        return json.loads(nutrition_text)
    except Exception as e:
        print(f"OpenAI nutrition info failed: {e}")
        # Try Google Gemini as fallback
        try:
            model = genai.GenerativeModel('gemini-1.5-pro')
            prompt = f"Extract calorie and macro information (protein, carbs, fats) from the following food item description and return it as a JSON object. {concise_instruction} If information is not available, use null. Example: {{'calories': 200, 'protein': 10, 'carbs': 20, 'fat': 5}}\nFood: {food_item}"
            response = model.generate_content(prompt)
            nutrition_text = response.text.strip()
            return json.loads(nutrition_text)
        except Exception as ge:
            print(f"Gemini nutrition info failed: {ge}")
            return {"error": f"Cohere error; OpenAI error: {e}; Gemini error: {ge}"}

# Default fallback responses for common gym-goer questions
GYM_FAQ_FALLBACKS = [
    (['protein', 'how much protein'], "A common guideline is about 1.6–2.2 grams of protein per kilogram of body weight per day for muscle gain. For most people, that's 100–160g per day. Spread it across your meals!"),
    (['best time to workout', 'when should I workout'], "The best time to work out is whenever you can stick to it! Some people prefer mornings for energy, others evenings. Consistency matters most."),
    (['pre workout', 'what to eat before workout'], "A good pre-workout meal is a mix of carbs and protein, like a banana with peanut butter or yogurt with fruit, 30–60 minutes before exercise."),
    (['post workout', 'what to eat after workout'], "After a workout, aim for protein and some carbs to help recovery—like a protein shake, chicken and rice, or eggs and toast."),
    (['lose weight', 'fat loss', 'how to lose fat'], "To lose weight, focus on a calorie deficit (burning more than you eat), regular exercise, and plenty of sleep. Small, sustainable changes work best!"),
    (['gain muscle', 'muscle gain', 'build muscle'], "To gain muscle, combine strength training with a slight calorie surplus and enough protein. Progressively increase weights and get enough rest!"),
    (['how much water', 'water intake'], "A good goal is about 2–3 liters (8–12 cups) of water per day, but needs vary. Drink more if you're sweating a lot!"),
    (['supplement', 'creatine', 'protein powder'], "Supplements like protein powder and creatine can help, but aren't required. Focus on whole foods first, and use supplements to fill gaps if needed."),
    (['rest day', 'should I take a rest day'], "Rest days are important! Your muscles need time to recover and grow. Listen to your body and take at least 1–2 rest days per week."),
    (['cardio or weights', 'cardio vs weights'], "Both cardio and weights are great! Cardio helps your heart and burns calories, weights build muscle and boost metabolism. Do both for best results!"),
]

@app.route('/chat', methods=['POST'])
@token_required
def chat_with_ai(user_id):
    data = request.get_json()
    user_message = data['user_message']
    concise_instruction = "Respond in 2 sentences or less. Be concise and to the point."
    # Try Cohere first
    if cohere_client:
        try:
            response = cohere_client.chat(
                model="command-r-plus",
                message=f"{user_message}\n{concise_instruction}",
                temperature=0.5
            )
            ai_reply = response.text.strip()
            new_interaction = AIInteraction(user_id=user_id, user_message=user_message, ai_reply=ai_reply)
            db.session.add(new_interaction)
            db.session.commit()
            return jsonify({'ai_reply': ai_reply})
        except Exception as ce:
            print(f"Cohere chat failed: {ce}")
    # Try OpenAI next
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are a helpful wellness coach. {concise_instruction}"},
                {"role": "user", "content": user_message}
            ]
        )
        ai_reply = response.choices[0].message['content'].strip()
        new_interaction = AIInteraction(user_id=user_id, user_message=user_message, ai_reply=ai_reply)
        db.session.add(new_interaction)
        db.session.commit()
        return jsonify({'ai_reply': ai_reply})
    except Exception as e:
        print(f"OpenAI chat failed: {e}")
        # Try Google Gemini as fallback
        try:
            model = genai.GenerativeModel('gemini-1.5-pro')
            prompt = f"You are a helpful wellness coach. {concise_instruction}\nUser: {user_message}"
            response = model.generate_content(prompt)
            ai_reply = response.text.strip()
            new_interaction = AIInteraction(user_id=user_id, user_message=user_message, ai_reply=ai_reply)
            db.session.add(new_interaction)
            db.session.commit()
            return jsonify({'ai_reply': ai_reply}), 200
        except Exception as ge:
            print(f"Gemini chat failed: {ge}")
            # Check for gym-goer FAQ fallbacks
            fallback_reply = None
            lower_msg = user_message.lower()
            for keywords, answer in GYM_FAQ_FALLBACKS:
                if any(k in lower_msg for k in keywords):
                    fallback_reply = answer
                    break
            if not fallback_reply:
                fallback_reply = "Sorry, I can't answer that right now, but I'm here to help with your wellness journey! Try again later or ask me about nutrition, exercise, or healthy habits."
            new_interaction = AIInteraction(user_id=user_id, user_message=user_message, ai_reply=fallback_reply)
            db.session.add(new_interaction)
            db.session.commit()
            return jsonify({'ai_reply': fallback_reply}), 200

@app.route('/chat/history', methods=['GET'])
@token_required
def get_chat_history(user_id):
    chat_history = AIInteraction.query.filter_by(user_id=user_id).order_by(AIInteraction.timestamp).all()

    # Format chat history for JSON response
    history_list = [{'user_message': interaction.user_message, 'ai_reply': interaction.ai_reply, 'timestamp': interaction.timestamp.isoformat()} for interaction in chat_history]
    return jsonify({'chat_history': history_list})

@app.route('/profile', methods=['GET'])
@token_required
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({
        'name': user.name,
        'streak': user.streak,
        'goals': user.goals,
        'wellness': user.wellness,
        'level': user.level
    })

@app.route('/profile', methods=['POST'])
@token_required
def update_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    data = request.get_json()
    user.name = data.get('name', user.name)
    user.streak = data.get('streak', user.streak)
    user.goals = data.get('goals', user.goals)
    user.wellness = data.get('wellness', user.wellness)
    user.level = data.get('level', user.level)
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully!'})

if __name__ == '__main__':
    openai.api_key = os.getenv("OPENAI_API_KEY")
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    with app.app_context():
        db.create_all()
    app.run(debug=True)
