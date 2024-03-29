use sqlx::{query, Error, Postgres, Transaction};

pub async fn store_3d_vector(
    vec3: [f32; 3usize],
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<i32, Error> {
    let id = query!(
        "INSERT INTO data_vec3
		(x, y, z)
		VALUES ($1, $2, $3) RETURNING id",
        vec3[0],
        vec3[1],
        vec3[2]
    )
    .fetch_one(&mut **transaction)
    .await?
    .id;

    return Ok(id);
}

pub async fn store_quaternion(
    vec4: [f32; 4usize],
    transaction: &mut Transaction<'_, Postgres>,
) -> Result<i32, sqlx::Error> {
    let id = sqlx::query!(
        "INSERT INTO data_quaternion
		(x, y, z, w)
		VALUES ($1, $2, $3, $4) RETURNING id",
        vec4[0],
        vec4[1],
        vec4[2],
        vec4[3]
    )
    .fetch_one(&mut **transaction)
    .await?
    .id;

    return Ok(id);
}
