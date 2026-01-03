CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_password';
SELECT pg_create_physical_replication_slot('replication_slot');

CREATE USER featurehub PASSWORD 'featurehub';
CREATE DATABASE featurehub;
GRANT ALL PRIVILEGES ON DATABASE featurehub TO featurehub;
