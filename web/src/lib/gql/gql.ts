/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query MyQuery {\n  data_vec3(limit: 10) {\n    id\n    x\n    y\n    z\n  }\n}\n\nsubscription LatestMessages($limit: Int = 10) {\n  rocket_message(order_by: {time_stamp: desc}, limit: $limit) {\n    id\n    message_type\n  }\n}\n\nsubscription LatestImu1 {\n  rocket_message(\n    where: {rocket_sensor_message: {rocket_sensor_imu_1: {rocket_sensor_message_id: {}}}}\n    order_by: {created_at: desc}\n    limit: 10\n  ) {\n    message_type\n    id\n    created_at\n    rocket_sensor_message {\n      component_id\n      rocket_sensor_imu_1 {\n        time_stamp\n        status\n        data_vec3ByGyroscopes {\n          z\n          y\n          x\n        }\n        data_vec3ByAccelerometers {\n          z\n          y\n          x\n        }\n      }\n    }\n  }\n}": types.MyQueryDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query MyQuery {\n  data_vec3(limit: 10) {\n    id\n    x\n    y\n    z\n  }\n}\n\nsubscription LatestMessages($limit: Int = 10) {\n  rocket_message(order_by: {time_stamp: desc}, limit: $limit) {\n    id\n    message_type\n  }\n}\n\nsubscription LatestImu1 {\n  rocket_message(\n    where: {rocket_sensor_message: {rocket_sensor_imu_1: {rocket_sensor_message_id: {}}}}\n    order_by: {created_at: desc}\n    limit: 10\n  ) {\n    message_type\n    id\n    created_at\n    rocket_sensor_message {\n      component_id\n      rocket_sensor_imu_1 {\n        time_stamp\n        status\n        data_vec3ByGyroscopes {\n          z\n          y\n          x\n        }\n        data_vec3ByAccelerometers {\n          z\n          y\n          x\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query MyQuery {\n  data_vec3(limit: 10) {\n    id\n    x\n    y\n    z\n  }\n}\n\nsubscription LatestMessages($limit: Int = 10) {\n  rocket_message(order_by: {time_stamp: desc}, limit: $limit) {\n    id\n    message_type\n  }\n}\n\nsubscription LatestImu1 {\n  rocket_message(\n    where: {rocket_sensor_message: {rocket_sensor_imu_1: {rocket_sensor_message_id: {}}}}\n    order_by: {created_at: desc}\n    limit: 10\n  ) {\n    message_type\n    id\n    created_at\n    rocket_sensor_message {\n      component_id\n      rocket_sensor_imu_1 {\n        time_stamp\n        status\n        data_vec3ByGyroscopes {\n          z\n          y\n          x\n        }\n        data_vec3ByAccelerometers {\n          z\n          y\n          x\n        }\n      }\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;