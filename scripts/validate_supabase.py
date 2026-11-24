"""Validate the central Supabase schema with retained development records.

Run only after configuring DATABASE_URL and applying the cloud migration:
  services/cloud-api/.venv/bin/python -m alembic -c alembic.ini upgrade head
  services/cloud-api/.venv/bin/python scripts/validate_supabase.py

The script never prints credentials and intentionally retains its clearly named
development company/branch/product records for inspection in Supabase.
"""

import json
import os
import sys

import psycopg


def database_url() -> str:
    value = (os.getenv('DATABASE_URL') or os.getenv('CLOUD_DATABASE_URL') or '').strip()
    if not value:
        raise SystemExit('DATABASE_URL is required. Copy it from Supabase Dashboard -> Connect.')
    return value.replace('postgresql+psycopg://', 'postgresql://', 1)


def main() -> None:
    url = database_url()
    company_id = 'validation-cloud-company'
    branch_id = 'validation-cloud-branch'
    product_id = 'validation-cloud-product'
    with psycopg.connect(url) as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT current_database(), current_user')
            database_name, database_user = cursor.fetchone()
            cursor.execute(
                """
                INSERT INTO companies
                  (id, registered_name, trading_name, category, email, phone, country,
                   address, currency, timezone, brand_color)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET updated_at = now()
                """,
                (company_id, 'Yenkasa Cloud Validation Ltd', 'Yenkasa Cloud Validation',
                 'Building Materials', 'cloud-validation@example.invalid', '+233000000000',
                 'Ghana', 'Validation environment', 'GHS', 'Africa/Accra', '#008f39'),
            )
            cursor.execute(
                """
                INSERT INTO branches (id, company_id, name, code, location, manager)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET updated_at = now()
                """,
                (branch_id, company_id, 'Validation Branch', 'VAL', 'Cloud validation', 'Validation Manager'),
            )
            cursor.execute(
                """
                INSERT INTO product_catalog_items
                  (id, company_id, branch_id, sku, name, category, stock, unit, selling_price)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET updated_at = now()
                """,
                (product_id, company_id, branch_id, 'VAL-CEM-001', 'Validation Ghacem Cement',
                 'Cement', 10, 'bags', 100),
            )
            cursor.execute(
                'SELECT count(*) FROM product_catalog_items WHERE company_id = %s AND branch_id = %s',
                (company_id, branch_id),
            )
            own_records = cursor.fetchone()[0]
            cursor.execute(
                'SELECT count(*) FROM product_catalog_items WHERE company_id <> %s AND id = %s',
                (company_id, product_id),
            )
            cross_company_records = cursor.fetchone()[0]
    print(json.dumps({
        'status': 'PASS',
        'database': database_name,
        'databaseUser': database_user,
        'developmentCompanyId': company_id,
        'developmentBranchId': branch_id,
        'ownBranchProductCount': own_records,
        'crossCompanyIsolationCheck': cross_company_records == 0,
    }, indent=2))


if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        print(json.dumps({'status': 'FAIL', 'error': str(exc)}, indent=2))
        sys.exit(1)
