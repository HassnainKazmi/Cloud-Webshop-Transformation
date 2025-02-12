#!/bin/bash
set -e

echo "Database ready"

flask db upgrade

echo "Migrations completed!"

exec flask run --host=0.0.0.0 --port=5000 --reload
