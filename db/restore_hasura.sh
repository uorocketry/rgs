DATABASE_URL=${DATABASE_URL:-"postgres://uorocketry:uorocketry@0.0.0.0:5432/postgres"}
SCHEMA_NAME="hdb_catalog"
FILE="dump/$SCHEMA_NAME.sql"

mkdir -p dump

# Restore Hasua schema from file
if [ -x "$(command -v docker)" ]; then
	echo "Using docker"
	docker exec -i rgs_timescaledb_1 sh -c "psql $DATABASE_URL" <$FILE
	exit 0
fi

if [ -f "$FILE" ]; then
	psql $DATABASE_URL <$FILE
else
	echo "Won't restore Hasura schema because $FILE doesn't exist"
fi
