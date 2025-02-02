"""Created Inventory table

Revision ID: 9e403938f079
Revises: b88e9eb33750
Create Date: 2025-02-01 17:00:15.913620

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9e403938f079"
down_revision = "b88e9eb33750"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "inventory",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("product_id", sa.Integer(), nullable=True),
        sa.Column("stock_quantity", sa.Integer(), nullable=False),
        sa.Column(
            "stock_level",
            sa.Enum("LOW", "MEDIUM", "HIGH", "OUT_OF_STOCK", name="stocklevel"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["product_id"],
            ["product.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("inventory")
    # ### end Alembic commands ###
