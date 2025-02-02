"""removed quantity column from products table

Revision ID: 4908ccc4f1d4
Revises: 68b792581c34
Create Date: 2025-02-02 01:55:43.849355

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = "4908ccc4f1d4"
down_revision = "68b792581c34"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("product", schema=None) as batch_op:
        batch_op.drop_column("quantity")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("product", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("quantity", mysql.INTEGER(), autoincrement=False, nullable=True)
        )

    # ### end Alembic commands ###
