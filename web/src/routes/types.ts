import { graphql } from 'gql.tada';

export const LatestImu1Document = graphql(`
	subscription LatestImu1 {
		rocket_message(
			where: { rocket_sensor_message: { rocket_sensor_imu_1: { rocket_sensor_message_id: {} } } }
			order_by: { created_at: desc }
			limit: 10
		) {
			message_type
			id
			created_at
			rocket_sensor_message {
				component_id
				rocket_sensor_imu_1 {
					time_stamp
					status
					data_vec3ByGyroscopes {
						z
						y
						x
					}
					data_vec3ByAccelerometers {
						z
						y
						x
					}
				}
			}
		}
	}
`);
