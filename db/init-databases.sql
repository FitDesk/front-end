CREATE DATABASE security_db;
CREATE DATABASE members_db;
CREATE DATABASE classes_db;
CREATE DATABASE billing_db;
CREATE DATABASE notifications_db;

CREATE USER security_user WITH PASSWORD 'admin';
CREATE USER members_user WITH PASSWORD 'admin';
CREATE USER classes_user WITH PASSWORD 'admin';
CREATE USER billing_user WITH PASSWORD 'admin';
CREATE USER notifications_user WITH PASSWORD 'admin';

GRANT ALL PRIVILEGES ON DATABASE security_db TO security_user;
GRANT ALL PRIVILEGES ON DATABASE members_db TO members_user;
GRANT ALL PRIVILEGES ON DATABASE classes_db TO classes_user;
GRANT ALL PRIVILEGES ON DATABASE billing_db TO billing_user;
GRANT ALL PRIVILEGES ON DATABASE notifications_db TO notifications_user;