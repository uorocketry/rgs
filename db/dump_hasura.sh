SCHEMA_NAME="hdb_catalog"
DATABASE_URL=${DATABASE_URL:-"postgres://uorocketry:uorocketry@0.0.0.0:5432/postgres"}

DUMP_COMMAND="pg_dump $DATABASE_URL -n $SCHEMA_NAME"

mkdir -p dump

# cat dump_hasura.sh | docker exec -i rgs_timescaledb_1 sh

# If we have docker installed, use it, otherwise use the local postgres
if [ -x "$(command -v docker)" ]; then
	echo "Using docker"
	docker exec -i rgs_timescaledb_1 sh -c "$DUMP_COMMAND" >dump/$SCHEMA_NAME.sql
	exit 0
fi

pg_dump $DATABASE_URL -n $SCHEMA_NAME
