"""make membership_id nullable in payment_history

Revision ID: fix_membership_nullable
Revises: 
Create Date: 2025-12-06

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fix_membership_nullable'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Make membership_id nullable so subscription payments can work without membership
    op.alter_column('payment_history', 'membership_id',
                    existing_type=sa.Integer(),
                    nullable=True)


def downgrade():
    op.alter_column('payment_history', 'membership_id',
                    existing_type=sa.Integer(),
                    nullable=False)
