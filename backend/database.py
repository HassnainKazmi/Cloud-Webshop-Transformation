from flask_sqlalchemy import SQLAlchemy
import app

app.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app.app)

with app.app.app_context():
    print('Creating database')
    db.create_all()
