import os
import sys
from pathlib import Path
os.environ['LOCAL_DATABASE_URL'] = 'sqlite://'
from fastapi.testclient import TestClient
sys.path.insert(0, str(Path(__file__).parents[2] / 'services' / 'local-api'))
from app.main import app

def test_health():
    response = TestClient(app).get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'

def test_company_and_branding_persist_in_sqlite():
    payload = {
        'registeredName': 'Test Builders Ltd', 'tradingName': 'Test Builders', 'category': 'Building Materials',
        'email': 'test@example.com', 'phone': '+233 20 000 0000', 'country': 'Ghana', 'address': 'Accra',
        'currency': 'GHS', 'timezone': 'Africa/Accra', 'brandColor': '#0B2D6B', 'tagline': 'Test tagline',
        'logoRef': '', 'secondaryColor': '#F7B500', 'accentColor': '#D7263D', 'showLogoReceipts': True,
        'showLogoInvoices': True, 'useBrandColours': True,
    }
    client = TestClient(app)
    saved = client.put('/api/company', json=payload)
    assert saved.status_code == 200
    assert saved.json()['tagline'] == 'Test tagline'
    assert client.get('/api/company').json()['tradingName'] == 'Test Builders'

def test_company_rejects_missing_required_details():
    response = TestClient(app).put('/api/company', json={'registeredName': '', 'tradingName': ''})
    assert response.status_code == 422
    assert 'error' in response.json()

def test_company_persists_logo_data_and_rejects_unsupported_logo():
    client = TestClient(app)
    payload = {
        'registeredName': 'Logo Builders Ltd', 'tradingName': 'Logo Builders', 'category': 'Building Materials',
        'email': 'logo@example.com', 'phone': '+233 20 000 0000', 'country': 'Ghana', 'address': 'Accra',
        'currency': 'GHS', 'timezone': 'Africa/Accra', 'brandColor': '#0B2D6B',
        'logoRef': 'data:image/png;base64,ZmFrZS1sb2dv', 'secondaryColor': '#F7B500',
        'accentColor': '#D7263D', 'showLogoReceipts': True, 'showLogoInvoices': True, 'useBrandColours': True,
    }
    saved = client.put('/api/company', json=payload)
    assert saved.status_code == 200
    assert client.get('/api/company').json()['logoRef'] == payload['logoRef']
    payload['logoRef'] = 'data:image/svg+xml;base64,ZmFrZQ=='
    rejected = client.put('/api/company', json=payload)
    assert rejected.status_code == 422
    assert rejected.json()['error']['message'] == 'Logo must be PNG, JPG or WebP image data'

def test_owner_account_persists_and_validates_photo():
    client = TestClient(app)
    payload = {
        'fullName': 'Validation Owner', 'role': 'Business Owner', 'phone': '+233 24 123 4567',
        'email': 'owner@example.com', 'identificationType': 'Ghana Card', 'idNumber': 'GHA-123',
        'dateOfBirth': '12 Jan 1989', 'gender': 'Male', 'photoRef': 'data:image/png;base64,ZmFrZS1waG90bw==',
    }
    saved = client.put('/api/owner', json=payload)
    assert saved.status_code == 200
    assert client.get('/api/owner').json()['fullName'] == 'Validation Owner'
    payload['photoRef'] = 'data:image/svg+xml;base64,ZmFrZQ=='
    rejected = client.put('/api/owner', json=payload)
    assert rejected.status_code == 422

def test_owner_security_persists_without_plaintext_password_and_activity_is_available_to_hq_only():
    client = TestClient(app)
    assert client.get('/api/owner/security').status_code == 403
    saved = client.put('/api/owner/security', headers={'X-Role': 'HQ_ADMIN'}, json={
        'username': 'secure.owner', 'email': 'secure@example.com', 'password': 'SecurePass123',
        'twoFactorEnabled': True, 'emailNotifications': True, 'smsNotifications': False,
        'recoveryPhone': '+233 20 111 2222', 'recoveryEmail': 'recovery@example.com',
    })
    assert saved.status_code == 200
    assert saved.json()['username'] == 'secure.owner'
    assert saved.json()['passwordSet'] is True
    persisted = client.get('/api/owner/security', headers={'X-Role': 'HQ_ADMIN'})
    assert persisted.status_code == 200
    assert persisted.json()['email'] == 'secure@example.com'
    assert 'SecurePass123' not in persisted.text
    activity = client.get('/api/owner/activity', headers={'X-Role': 'HQ_ADMIN'})
    assert activity.status_code == 200
    assert any(row['activityType'] == 'Security' and row['action'] == 'owner_security_updated' for row in activity.json())

def test_cloud_configuration_is_hq_only_and_rejects_invalid_connection_without_secret_leak():
    client = TestClient(app)
    assert client.get('/api/cloud/configuration').status_code == 403
    response = client.post('/api/cloud/test', headers={'X-Role': 'HQ_ADMIN'}, json={
        'projectUrl': 'not-a-url', 'projectRef': 'dev-project',
        'databaseHost': 'db.example.com', 'databasePort': 5432,
        'databaseName': 'postgres', 'databaseUser': 'postgres',
        'databasePassword': 'DoNotLeakThisPassword',
    })
    assert response.status_code == 422
    assert 'DoNotLeakThisPassword' not in response.text

def test_branches_require_headquarters_role_and_persist():
    client = TestClient(app)
    payload = {'name': 'Validation Branch', 'code': 'VB', 'location': 'Accra', 'phone': '+233 20 000 0000', 'manager': 'Validation Manager'}
    forbidden = client.post('/api/branches', json=payload)
    assert forbidden.status_code == 403
    created = client.post('/api/branches', json=payload, headers={'X-Role': 'HQ_ADMIN'})
    assert created.status_code == 200
    assert created.json()['code'] == 'VB'
    assert any(branch['code'] == 'VB' for branch in client.get('/api/branches').json())
    duplicate = client.post('/api/branches', json=payload, headers={'X-Role': 'HQ_ADMIN'})
    assert duplicate.status_code == 409

def test_branch_authentication_enforces_role_and_branch_manager_staff_scope():
    client = TestClient(app)
    payload = {
        'name': 'Auth Branch', 'code': 'AUTH', 'location': 'Oyarifa', 'manager': 'Auth Manager',
        'managerUsername': 'auth.manager', 'managerPassword': 'ManagerPass123', 'managerRole': 'BRANCH_MANAGER',
        'deviceName': 'AUTH-PC-01', 'activateDevice': True,
    }
    created = client.post('/api/branches', json=payload, headers={'X-Role': 'HQ_ADMIN'})
    assert created.status_code == 200
    branch_id = created.json()['id']
    assert any(branch['id'] == branch_id for branch in client.get('/api/activated-branches').json())
    wrong_password = client.post('/api/auth/login', json={'branchId': branch_id, 'username': 'auth.manager', 'password': 'wrong-pass', 'loginRole': 'BRANCH_MANAGER'})
    assert wrong_password.status_code == 401
    mismatch = client.post('/api/auth/login', json={'branchId': branch_id, 'username': 'auth.manager', 'password': 'ManagerPass123', 'loginRole': 'SALES_CASHIER'})
    assert mismatch.status_code == 403
    manager_login = client.post('/api/auth/login', json={'branchId': branch_id, 'username': 'auth.manager', 'password': 'ManagerPass123', 'loginRole': 'BRANCH_MANAGER'})
    assert manager_login.status_code == 200
    manager = manager_login.json()
    assert manager['role'] == 'BRANCH_MANAGER'
    assert 'password' not in manager
    staff = client.post('/api/staff', json={'branchId': branch_id, 'username': 'stock.auth', 'fullName': 'Stock Auth', 'email': 'stock@example.com', 'role': 'STOCK_MANAGER', 'password': 'StockPass123'}, headers={'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id})
    assert staff.status_code == 200
    assert 'password' not in staff.json()
    staff_id = staff.json()['id']
    staff_elevate = client.post('/api/staff', json={'branchId': branch_id, 'username': 'owner.try', 'fullName': 'Owner Try', 'role': 'BRANCH_MANAGER', 'password': 'OwnerPass123'}, headers={'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id})
    assert staff_elevate.status_code == 403
    stock_login = client.post('/api/auth/login', json={'branchId': branch_id, 'username': 'stock.auth', 'password': 'StockPass123', 'loginRole': 'STOCK_MANAGER'})
    assert stock_login.status_code == 200
    stock = stock_login.json()
    assert client.post('/api/branch-actions/purchases', headers={'X-User-Id': stock['userId'], 'X-Branch-Id': branch_id}).status_code == 200
    assert client.post('/api/branch-actions/staff_management', headers={'X-User-Id': stock['userId'], 'X-Branch-Id': branch_id}).status_code == 403
    assert client.get('/api/company-users').status_code == 403
    company_users = client.get('/api/company-users', headers={'X-Role': 'HQ_ADMIN'})
    assert company_users.status_code == 200
    assert any(user['username'] == 'stock.auth' and user['branchName'] == 'Auth Branch' for user in company_users.json())
    assert client.patch(f'/api/staff/{staff_id}', json={'active': False}, headers={'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id}).status_code == 200
    deactivated = client.post('/api/auth/login', json={'branchId': branch_id, 'username': 'stock.auth', 'password': 'StockPass123', 'loginRole': 'STOCK_MANAGER'})
    assert deactivated.status_code == 401

def test_cross_branch_staff_access_is_rejected():
    client = TestClient(app)
    first = client.post('/api/branches', json={'name': 'Isolation One', 'code': 'ISO1', 'location': 'Accra', 'manager': 'Iso One', 'managerUsername': 'iso.one', 'managerPassword': 'IsoPass123'}, headers={'X-Role': 'HQ_ADMIN'}).json()
    second = client.post('/api/branches', json={'name': 'Isolation Two', 'code': 'ISO2', 'location': 'Tema', 'manager': 'Iso Two', 'managerUsername': 'iso.two', 'managerPassword': 'IsoPass123'}, headers={'X-Role': 'HQ_ADMIN'}).json()
    manager = client.post('/api/auth/login', json={'branchId': first['id'], 'username': 'iso.one', 'password': 'IsoPass123', 'loginRole': 'BRANCH_MANAGER'}).json()
    cross_branch = client.post('/api/staff', json={'branchId': second['id'], 'username': 'cross.try', 'fullName': 'Cross Try', 'role': 'SALES_CASHIER', 'password': 'CrossPass123'}, headers={'X-User-Id': manager['userId'], 'X-Branch-Id': second['id']})
    assert cross_branch.status_code == 403

def test_device_activation_requires_hq_and_persists_status():
    client = TestClient(app)
    branch = client.post('/api/branches', json={'name': 'Device Branch', 'code': 'DEV1', 'location': 'Accra', 'manager': 'Device Manager', 'managerUsername': 'device.manager', 'managerPassword': 'DevicePass123'}, headers={'X-Role': 'HQ_ADMIN'}).json()
    assert client.get('/api/devices').status_code == 403
    created = client.post('/api/devices', json={'branchId': branch['id'], 'deviceName': 'DEV-PC-02', 'deviceType': 'macOS', 'validity': 'Permanent'}, headers={'X-Role': 'HQ_ADMIN'})
    assert created.status_code == 200
    assert created.json()['activationCode'].startswith('YK-')
    revoked = client.patch(f"/api/devices/{created.json()['id']}", json={'active': False}, headers={'X-Role': 'HQ_ADMIN'})
    assert revoked.status_code == 200
    assert revoked.json()['active'] is False

def test_sales_uses_branch_catalogue_prices_and_company_invoice_template_snapshot():
    client = TestClient(app)
    company = client.get('/api/company').json()
    company['documentTemplates'] = {
        'templateId': 'invoice-test-template', 'templateName': 'Test Company Invoice', 'version': 7,
        'selectedDocument': 'Invoice Template', 'layoutStyle': 'Classic', 'pageSize': 'A4 (210 x 297 mm)',
        'showCompanyLogo': True, 'showCompanyDetails': True, 'showBranchInformation': True,
        'showFooterMessage': True, 'footerMessage': 'Test footer', 'content': {
            'companyName': 'Test Builders', 'branchName': 'Test Branch', 'companyPhone': '', 'companyEmail': '',
            'invoiceNumber': 'TEST-1', 'date': '23 Nov 2026', 'dueDate': '', 'billToName': 'Customer',
            'billToAddress': '', 'billToPhone': '', 'paymentTerms': 'Cash', 'notes': '', 'items': [],
            'discountPercent': '0', 'vatPercent': '15', 'amountPaid': '0',
        }, 'styles': {'headingFontFamily': 'Arial', 'headingFontSize': '20', 'headingColor': '#0B7E34', 'headingBold': True, 'logoWidth': '170', 'logoHeight': '88', 'logoOffsetX': '0', 'logoOffsetY': '0'},
    }
    assert client.put('/api/company', json=company).status_code == 200
    branch = client.post('/api/branches', json={'name': 'Sales Catalog Branch', 'code': 'SALCAT', 'location': 'Accra', 'manager': 'Sales Catalog Manager', 'managerUsername': 'sales.catalog.manager', 'managerPassword': 'SalesCatalogPass123'}, headers={'X-Role': 'HQ_ADMIN'}).json()
    branch_id = branch['id']
    manager = client.post('/api/auth/login', json={'branchId': branch_id, 'username': 'sales.catalog.manager', 'password': 'SalesCatalogPass123', 'loginRole': 'BRANCH_MANAGER'}).json()
    products = client.get(f'/api/products?branchId={branch_id}', headers={'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id})
    assert products.status_code == 200
    ghacem = next(item for item in products.json() if item['brand'] == 'Ghacem' and item['productType'] == 'Rapid Strength Cement')
    invoice = client.post('/api/sales', headers={'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id}, json={'branchId': branch_id, 'documentType': 'INVOICE', 'customerName': 'Catalog Customer', 'vatPercent': 15, 'items': [{'sku': ghacem['sku'], 'name': 'tampered name', 'quantity': 1, 'unit': 'tampered', 'unitPrice': 1, 'discountPercent': 0}]})
    assert invoice.status_code == 200
    assert invoice.json()['items'][0]['name'] == ghacem['name']
    assert invoice.json()['items'][0]['unitPrice'] == ghacem['price']
    assert invoice.json()['templateId'] == 'invoice-test-template'
    assert invoice.json()['templateVersion'] == 7
    assert client.post('/api/sales', json={'branchId': branch_id, 'documentType': 'INVOICE', 'customerName': 'No Auth', 'items': []}).status_code == 401

def test_separate_branch_roles_receive_only_authorized_permissions():
    client = TestClient(app)
    branch = client.post('/api/branches', json={'name': 'Role Separation Branch', 'code': 'ROLESEP', 'location': 'Accra', 'manager': 'Role Manager', 'managerUsername': 'role.manager', 'managerPassword': 'RoleManagerPass123'}, headers={'X-Role': 'HQ_ADMIN'}).json()
    branch_id = branch['id']
    manager = client.post('/api/auth/login', json={'branchId': branch_id, 'username': 'role.manager', 'password': 'RoleManagerPass123', 'loginRole': 'BRANCH_MANAGER'}).json()
    created = {}
    for role, username, password in [('SALES_OFFICER', 'role.sales', 'RoleSalesPass123'), ('CASHIER', 'role.cashier', 'RoleCashierPass123'), ('STOCK_MANAGER', 'role.stock', 'RoleStockPass123')]:
        response = client.post('/api/staff', headers={'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id}, json={'branchId': branch_id, 'username': username, 'fullName': username, 'role': role, 'password': password})
        assert response.status_code == 200
        created[role] = client.post('/api/auth/login', json={'branchId': branch_id, 'username': username, 'password': password, 'loginRole': role}).json()
    assert 'sales' in created['SALES_OFFICER']['permissions'] and 'payments' not in created['SALES_OFFICER']['permissions']
    assert 'payments' in created['CASHIER']['permissions'] and 'sales' not in created['CASHIER']['permissions']
    assert 'material_release' in created['STOCK_MANAGER']['permissions'] and 'payments' not in created['STOCK_MANAGER']['permissions']
    assert client.post('/api/branch-actions/payments', headers={'X-User-Id': created['SALES_OFFICER']['userId'], 'X-Branch-Id': branch_id}).status_code == 403
    assert client.post('/api/branch-actions/sales', headers={'X-User-Id': created['CASHIER']['userId'], 'X-Branch-Id': branch_id}).status_code == 403
    assert client.post('/api/branch-actions/material_release', headers={'X-User-Id': created['STOCK_MANAGER']['userId'], 'X-Branch-Id': branch_id}).status_code == 200
    assert client.post('/api/branch-actions/payments', headers={'X-User-Id': created['STOCK_MANAGER']['userId'], 'X-Branch-Id': branch_id}).status_code == 403

def test_branch_manager_controls_sync_settings_and_owner_sees_branch_status(monkeypatch):
    monkeypatch.delenv('DATABASE_URL', raising=False)
    monkeypatch.delenv('SYNC_BACKEND_URL', raising=False)
    client = TestClient(app)
    branch = client.post('/api/branches', json={
        'name': 'Sync Validation Branch', 'code': 'SYNCV', 'location': 'Accra',
        'manager': 'Sync Manager', 'managerUsername': 'sync.manager',
        'managerPassword': 'SyncManagerPass123',
    }, headers={'X-Role': 'HQ_ADMIN'}).json()
    branch_id = branch['id']
    manager = client.post('/api/auth/login', json={
        'branchId': branch_id, 'username': 'sync.manager',
        'password': 'SyncManagerPass123', 'loginRole': 'BRANCH_MANAGER',
    }).json()
    headers = {'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id}

    initial = client.get(f'/api/sync/status?branchId={branch_id}', headers=headers)
    assert initial.status_code == 200
    assert initial.json()['syncState'] == 'NEVER_SYNCED'
    disabled = client.put('/api/sync/settings', headers=headers, json={
        'branchId': branch_id, 'onlineEnabled': False,
        'autoSyncEnabled': False, 'intervalMinutes': 30,
    })
    assert disabled.status_code == 200
    assert disabled.json()['onlineEnabled'] is False
    offline_run = client.post('/api/sync/run', headers=headers, json={'branchId': branch_id})
    assert offline_run.status_code == 200
    assert offline_run.json()['syncState'] == 'OFFLINE'
    assert offline_run.json()['synced'] is False

    enabled = client.put('/api/sync/settings', headers=headers, json={
        'branchId': branch_id, 'onlineEnabled': True,
        'autoSyncEnabled': True, 'intervalMinutes': 15,
    })
    assert enabled.status_code == 200
    cloud_run = client.post('/api/sync/run', headers=headers, json={'branchId': branch_id})
    assert cloud_run.status_code == 200
    assert cloud_run.json()['syncState'] == 'CLOUD_NOT_CONFIGURED'

    sales_staff = client.post('/api/staff', headers=headers, json={
        'branchId': branch_id, 'username': 'sync.sales', 'fullName': 'Sync Sales',
        'role': 'SALES_OFFICER', 'password': 'SyncSalesPass123',
    }).json()
    denied = client.get(f'/api/sync/status?branchId={branch_id}', headers={
        'X-User-Id': sales_staff['id'], 'X-Branch-Id': branch_id,
    })
    assert denied.status_code == 403

    activity = client.get('/api/owner/activity', headers={'X-Role': 'HQ_ADMIN'})
    assert activity.status_code == 200
    sync_rows = [row for row in activity.json() if row['activityType'] == 'Branch Sync' and branch['name'] in row['details']]
    assert sync_rows
    assert 'Cloud Not Configured' in sync_rows[0]['details']

def test_configured_cloud_database_is_reflected_in_sync_status(monkeypatch):
    monkeypatch.setenv('CLOUD_DATABASE_URL', 'postgresql://configured-cloud.example/postgres')
    client = TestClient(app)
    branch = client.post('/api/branches', json={
        'name': 'Configured Cloud Branch', 'code': 'CLOUDV', 'location': 'Accra',
        'manager': 'Cloud Manager', 'managerUsername': 'cloud.manager',
        'managerPassword': 'CloudManagerPass123',
    }, headers={'X-Role': 'HQ_ADMIN'}).json()
    manager = client.post('/api/auth/login', json={
        'branchId': branch['id'], 'username': 'cloud.manager',
        'password': 'CloudManagerPass123', 'loginRole': 'BRANCH_MANAGER',
    }).json()
    headers = {'X-User-Id': manager['userId'], 'X-Branch-Id': branch['id']}
    result = client.post('/api/sync/run', headers=headers, json={'branchId': branch['id']})
    assert result.status_code == 200
    assert result.json()['syncState'] == 'CLOUD_READY'
    assert 'CLOUD_NOT_CONFIGURED' not in result.text

def test_cashier_payment_workflow_is_branch_scoped_and_idempotent():
    client = TestClient(app)
    branch = client.post('/api/branches', json={
        'name': 'Cashier Workflow Branch', 'code': 'CASHWF', 'location': 'Accra',
        'manager': 'Cashier Workflow Manager', 'managerUsername': 'cash.workflow.manager',
        'managerPassword': 'CashWorkflowManager123',
    }, headers={'X-Role': 'HQ_ADMIN'}).json()
    branch_id = branch['id']
    manager = client.post('/api/auth/login', json={
        'branchId': branch_id, 'username': 'cash.workflow.manager',
        'password': 'CashWorkflowManager123', 'loginRole': 'BRANCH_MANAGER',
    }).json()
    cashier = client.post('/api/staff', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    }, json={
        'branchId': branch_id, 'username': 'cash.workflow.cashier',
        'fullName': 'Cash Workflow Cashier', 'role': 'CASHIER',
        'password': 'CashWorkflowCashier123',
    }).json()
    cashier_login = client.post('/api/auth/login', json={
        'branchId': branch_id, 'username': 'cash.workflow.cashier',
        'password': 'CashWorkflowCashier123', 'loginRole': 'CASHIER',
    }).json()
    products = client.get(f'/api/products?branchId={branch_id}', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    }).json()
    product = products[0]
    invoice = client.post('/api/sales', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    }, json={
        'branchId': branch_id, 'documentType': 'INVOICE',
        'customerName': 'Cash Workflow Customer', 'vatPercent': 0,
        'items': [{'sku': product['sku'], 'name': product['name'], 'quantity': 1,
                   'unit': product['unit'], 'unitPrice': product['price'], 'discountPercent': 0}],
    })
    assert invoice.status_code == 200
    invoice_data = invoice.json()
    assert invoice_data['paymentStatus'] == 'UNPAID'
    assert invoice_data['fulfilmentStatus'] == 'AWAITING_PAYMENT'
    assert client.get(f'/api/cashier/invoices?branchId={branch_id}', headers={
        'X-User-Id': cashier_login['userId'], 'X-Branch-Id': branch_id,
    }).status_code == 200
    assert client.get(f'/api/sales?branchId={branch_id}', headers={
        'X-User-Id': cashier_login['userId'], 'X-Branch-Id': branch_id,
    }).status_code == 403

    payment_payload = {
        'branchId': branch_id, 'saleId': invoice_data['id'],
        'amount': invoice_data['total'], 'method': 'CASH',
        'idempotencyKey': 'cash-workflow-payment-1',
    }
    payment = client.post('/api/payments', headers={
        'X-User-Id': cashier_login['userId'], 'X-Branch-Id': branch_id,
    }, json=payment_payload)
    assert payment.status_code == 200
    payment_data = payment.json()
    assert payment_data['payment']['verificationStatus'] == 'VERIFIED'
    assert payment_data['receipt']['receiptNumber'].startswith('CASHWF-RCP-')
    assert payment_data['invoice']['paymentStatus'] == 'PAID'
    assert payment_data['invoice']['fulfilmentStatus'] == 'AWAITING_RELEASE'
    duplicate = client.post('/api/payments', headers={
        'X-User-Id': cashier_login['userId'], 'X-Branch-Id': branch_id,
    }, json=payment_payload)
    assert duplicate.status_code == 200
    assert duplicate.json()['payment']['id'] == payment_data['payment']['id']
    assert client.post('/api/payments', headers={
        'X-User-Id': cashier_login['userId'], 'X-Branch-Id': branch_id,
    }, json={**payment_payload, 'idempotencyKey': 'cash-workflow-overpay', 'amount': 1}).status_code == 422

    sales_officer = client.post('/api/staff', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    }, json={
        'branchId': branch_id, 'username': 'cash.workflow.sales',
        'fullName': 'Cash Workflow Sales', 'role': 'SALES_OFFICER',
        'password': 'CashWorkflowSales123',
    }).json()
    assert client.post('/api/payments', headers={
        'X-User-Id': sales_officer['id'], 'X-Branch-Id': branch_id,
    }, json=payment_payload).status_code == 403

    second_invoice = client.post('/api/sales', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    }, json={
        'branchId': branch_id, 'documentType': 'INVOICE',
        'customerName': 'Electronic Workflow Customer', 'vatPercent': 0,
        'items': [{'sku': product['sku'], 'name': product['name'], 'quantity': 1,
                   'unit': product['unit'], 'unitPrice': product['price'], 'discountPercent': 0}],
    }).json()
    pending = client.post('/api/payments', headers={
        'X-User-Id': cashier_login['userId'], 'X-Branch-Id': branch_id,
    }, json={
        'branchId': branch_id, 'saleId': second_invoice['id'],
        'amount': second_invoice['total'], 'method': 'MOBILE_MONEY',
        'reference': 'MOMO-VALIDATION-001', 'idempotencyKey': 'momo-workflow-payment-1',
    })
    assert pending.status_code == 200
    assert pending.json()['payment']['verificationStatus'] == 'PENDING_VERIFICATION'
    assert pending.json()['invoice']['paymentStatus'] == 'UNPAID'
    verified = client.post(f"/api/payments/{pending.json()['payment']['id']}/verify", headers={
        'X-User-Id': cashier_login['userId'], 'X-Branch-Id': branch_id,
    }, json={'evidenceNote': 'Validation provider confirmation reviewed by cashier'})
    assert verified.status_code == 200
    assert verified.json()['payment']['verificationStatus'] == 'VERIFIED_MANUAL'
    assert verified.json()['invoice']['paymentStatus'] == 'PAID'

    release_candidates = client.get(f'/api/material-release/invoices?branchId={branch_id}', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    })
    assert release_candidates.status_code == 200
    first_release_invoice = next(item for item in release_candidates.json() if item['id'] == invoice_data['id'])
    release = client.post('/api/material-releases', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    }, json={
        'branchId': branch_id, 'saleId': invoice_data['id'],
        'items': [{'sku': product['sku'], 'quantity': 1}],
    })
    assert release.status_code == 200
    assert release.json()['release']['status'] == 'RELEASED'
    assert release.json()['invoice']['fulfilmentStatus'] == 'RELEASED'
    duplicate_release = client.post('/api/material-releases', headers={
        'X-User-Id': manager['userId'], 'X-Branch-Id': branch_id,
    }, json={
        'branchId': branch_id, 'saleId': invoice_data['id'],
        'items': [{'sku': product['sku'], 'quantity': 1}],
    })
    assert duplicate_release.status_code == 409
    assert first_release_invoice['receiptNumber'].startswith('CASHWF-RCP-')
