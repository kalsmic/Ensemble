import os

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from flaskr import create_app
from flaskr.models import db

app = create_app()
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command("db", MigrateCommand)


@manager.command
def db_drop_and_create_all():
    db.drop_all()
    db.create_all()


if __name__ == "__main__":
    manager.run()
