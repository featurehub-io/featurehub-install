#!/bin/sh
echo "adding replication config"
echo "host replication all 0.0.0.0/0 md5" >> /var/lib/postgresql/pg_hba.conf