from flask import request
from flask_restful import Resource, marshal_with, abort

import database
from models.models import User as UserModel

from utils.user_request_arguments import post_user_arguments
from utils.utils import is_it_true


class User(Resource):
    def post(self):
        """Creates an user (admin or simple depending on the flag passes)"""
        args = post_user_arguments.parse_args(strict=True)
        first_name = args.get("first_name")
        last_name = args.get("last_name")
        email = args.get("email")
        is_admin = is_it_true(request.headers.get("admin"))

        if UserModel.query.filter(UserModel.email == email).first():
            abort(400, message=f"User with email {email} already exists!")

        user = UserModel(
            first_name=first_name,
            last_name=last_name,
            email=email,
            is_admin=is_admin,
            address="some address placeholder",
        )
        database.db.session.add(user)
        database.db.session.commit()

        return "User created", 201
