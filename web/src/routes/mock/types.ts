import { graphql } from 'gql.tada';

export const InsertQuaternionDocument = graphql(`
	mutation InsertQuaternionMutation(
		$time_stamp: Int = 10
		$time_stamp1: Int = 10
		$w: Float = 1.5
		$x: Float = 1.5
		$y: Float = 1.5
		$z: Float = 1.5
	) {
		insert_rocket_message(
			objects: {
				rocket_sensor_message: {
					data: {
						rocket_sensor_quat: {
							data: {
								data_quaternion: { data: { w: $w, x: $x, y: $y, z: $z } }
								data_vec3: { data: { x: 0, y: 0, z: 0 } }
								status: 10
								time_stamp: $time_stamp1
							}
						}
						component_id: 0
					}
				}
				time_stamp: $time_stamp
				sender: "phone"
				message_type: "sensor"
			}
		) {
			affected_rows
		}
	}
`);
