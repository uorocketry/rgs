/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  timestamp: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Float". All fields are combined with logical 'AND'. */
export type Float_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Float']['input']>;
  _gt?: InputMaybe<Scalars['Float']['input']>;
  _gte?: InputMaybe<Scalars['Float']['input']>;
  _in?: InputMaybe<Array<Scalars['Float']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Float']['input']>;
  _lte?: InputMaybe<Scalars['Float']['input']>;
  _neq?: InputMaybe<Scalars['Float']['input']>;
  _nin?: InputMaybe<Array<Scalars['Float']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "data_quaternion" */
export type Data_Quaternion = {
  __typename?: 'data_quaternion';
  id: Scalars['Int']['output'];
  /** An array relationship */
  rocket_sensor_quats: Array<Rocket_Sensor_Quat>;
  /** An aggregate relationship */
  rocket_sensor_quats_aggregate: Rocket_Sensor_Quat_Aggregate;
  w: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Float']['output'];
};


/** columns and relationships of "data_quaternion" */
export type Data_QuaternionRocket_Sensor_QuatsArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};


/** columns and relationships of "data_quaternion" */
export type Data_QuaternionRocket_Sensor_Quats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};

/** aggregated selection of "data_quaternion" */
export type Data_Quaternion_Aggregate = {
  __typename?: 'data_quaternion_aggregate';
  aggregate?: Maybe<Data_Quaternion_Aggregate_Fields>;
  nodes: Array<Data_Quaternion>;
};

/** aggregate fields of "data_quaternion" */
export type Data_Quaternion_Aggregate_Fields = {
  __typename?: 'data_quaternion_aggregate_fields';
  avg?: Maybe<Data_Quaternion_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Data_Quaternion_Max_Fields>;
  min?: Maybe<Data_Quaternion_Min_Fields>;
  stddev?: Maybe<Data_Quaternion_Stddev_Fields>;
  stddev_pop?: Maybe<Data_Quaternion_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Data_Quaternion_Stddev_Samp_Fields>;
  sum?: Maybe<Data_Quaternion_Sum_Fields>;
  var_pop?: Maybe<Data_Quaternion_Var_Pop_Fields>;
  var_samp?: Maybe<Data_Quaternion_Var_Samp_Fields>;
  variance?: Maybe<Data_Quaternion_Variance_Fields>;
};


/** aggregate fields of "data_quaternion" */
export type Data_Quaternion_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Data_Quaternion_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Data_Quaternion_Avg_Fields = {
  __typename?: 'data_quaternion_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "data_quaternion". All fields are combined with a logical 'AND'. */
export type Data_Quaternion_Bool_Exp = {
  _and?: InputMaybe<Array<Data_Quaternion_Bool_Exp>>;
  _not?: InputMaybe<Data_Quaternion_Bool_Exp>;
  _or?: InputMaybe<Array<Data_Quaternion_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_quats?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
  rocket_sensor_quats_aggregate?: InputMaybe<Rocket_Sensor_Quat_Aggregate_Bool_Exp>;
  w?: InputMaybe<Float_Comparison_Exp>;
  x?: InputMaybe<Float_Comparison_Exp>;
  y?: InputMaybe<Float_Comparison_Exp>;
  z?: InputMaybe<Float_Comparison_Exp>;
};

/** unique or primary key constraints on table "data_quaternion" */
export enum Data_Quaternion_Constraint {
  /** unique or primary key constraint on columns "id" */
  DataQuaternionPkey = 'data_quaternion_pkey'
}

/** input type for incrementing numeric columns in table "data_quaternion" */
export type Data_Quaternion_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  w?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** input type for inserting data into table "data_quaternion" */
export type Data_Quaternion_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_quats?: InputMaybe<Rocket_Sensor_Quat_Arr_Rel_Insert_Input>;
  w?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate max on columns */
export type Data_Quaternion_Max_Fields = {
  __typename?: 'data_quaternion_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate min on columns */
export type Data_Quaternion_Min_Fields = {
  __typename?: 'data_quaternion_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** response of any mutation on the table "data_quaternion" */
export type Data_Quaternion_Mutation_Response = {
  __typename?: 'data_quaternion_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Data_Quaternion>;
};

/** input type for inserting object relation for remote table "data_quaternion" */
export type Data_Quaternion_Obj_Rel_Insert_Input = {
  data: Data_Quaternion_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Data_Quaternion_On_Conflict>;
};

/** on_conflict condition type for table "data_quaternion" */
export type Data_Quaternion_On_Conflict = {
  constraint: Data_Quaternion_Constraint;
  update_columns?: Array<Data_Quaternion_Update_Column>;
  where?: InputMaybe<Data_Quaternion_Bool_Exp>;
};

/** Ordering options when selecting data from "data_quaternion". */
export type Data_Quaternion_Order_By = {
  id?: InputMaybe<Order_By>;
  rocket_sensor_quats_aggregate?: InputMaybe<Rocket_Sensor_Quat_Aggregate_Order_By>;
  w?: InputMaybe<Order_By>;
  x?: InputMaybe<Order_By>;
  y?: InputMaybe<Order_By>;
  z?: InputMaybe<Order_By>;
};

/** primary key columns input for table: data_quaternion */
export type Data_Quaternion_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "data_quaternion" */
export enum Data_Quaternion_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  W = 'w',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y',
  /** column name */
  Z = 'z'
}

/** input type for updating data in table "data_quaternion" */
export type Data_Quaternion_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  w?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate stddev on columns */
export type Data_Quaternion_Stddev_Fields = {
  __typename?: 'data_quaternion_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Data_Quaternion_Stddev_Pop_Fields = {
  __typename?: 'data_quaternion_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Data_Quaternion_Stddev_Samp_Fields = {
  __typename?: 'data_quaternion_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "data_quaternion" */
export type Data_Quaternion_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Data_Quaternion_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Data_Quaternion_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  w?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate sum on columns */
export type Data_Quaternion_Sum_Fields = {
  __typename?: 'data_quaternion_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** update columns of table "data_quaternion" */
export enum Data_Quaternion_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  W = 'w',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y',
  /** column name */
  Z = 'z'
}

export type Data_Quaternion_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Data_Quaternion_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Data_Quaternion_Set_Input>;
  /** filter the rows which have to be updated */
  where: Data_Quaternion_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Data_Quaternion_Var_Pop_Fields = {
  __typename?: 'data_quaternion_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Data_Quaternion_Var_Samp_Fields = {
  __typename?: 'data_quaternion_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Data_Quaternion_Variance_Fields = {
  __typename?: 'data_quaternion_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "data_vec3" */
export type Data_Vec3 = {
  __typename?: 'data_vec3';
  id: Scalars['Int']['output'];
  /** An array relationship */
  rocketSensorGpsVelsByVelocity: Array<Rocket_Sensor_Gps_Vel>;
  /** An aggregate relationship */
  rocketSensorGpsVelsByVelocity_aggregate: Rocket_Sensor_Gps_Vel_Aggregate;
  /** An array relationship */
  rocketSensorImu1sByGyroscopes: Array<Rocket_Sensor_Imu_1>;
  /** An aggregate relationship */
  rocketSensorImu1sByGyroscopes_aggregate: Rocket_Sensor_Imu_1_Aggregate;
  /** An array relationship */
  rocketSensorImu2sByDeltaVelocity: Array<Rocket_Sensor_Imu_2>;
  /** An aggregate relationship */
  rocketSensorImu2sByDeltaVelocity_aggregate: Rocket_Sensor_Imu_2_Aggregate;
  /** An array relationship */
  rocketSensorNav1sByVelocityStdDev: Array<Rocket_Sensor_Nav_1>;
  /** An aggregate relationship */
  rocketSensorNav1sByVelocityStdDev_aggregate: Rocket_Sensor_Nav_1_Aggregate;
  /** An array relationship */
  rocketSensorNav2sByPositionStdDev: Array<Rocket_Sensor_Nav_2>;
  /** An aggregate relationship */
  rocketSensorNav2sByPositionStdDev_aggregate: Rocket_Sensor_Nav_2_Aggregate;
  /** An array relationship */
  rocket_sensor_gps_vels: Array<Rocket_Sensor_Gps_Vel>;
  /** An aggregate relationship */
  rocket_sensor_gps_vels_aggregate: Rocket_Sensor_Gps_Vel_Aggregate;
  /** An array relationship */
  rocket_sensor_imu_1s: Array<Rocket_Sensor_Imu_1>;
  /** An aggregate relationship */
  rocket_sensor_imu_1s_aggregate: Rocket_Sensor_Imu_1_Aggregate;
  /** An array relationship */
  rocket_sensor_imu_2s: Array<Rocket_Sensor_Imu_2>;
  /** An aggregate relationship */
  rocket_sensor_imu_2s_aggregate: Rocket_Sensor_Imu_2_Aggregate;
  /** An array relationship */
  rocket_sensor_nav_1s: Array<Rocket_Sensor_Nav_1>;
  /** An aggregate relationship */
  rocket_sensor_nav_1s_aggregate: Rocket_Sensor_Nav_1_Aggregate;
  /** An array relationship */
  rocket_sensor_nav_2s: Array<Rocket_Sensor_Nav_2>;
  /** An aggregate relationship */
  rocket_sensor_nav_2s_aggregate: Rocket_Sensor_Nav_2_Aggregate;
  /** An array relationship */
  rocket_sensor_quats: Array<Rocket_Sensor_Quat>;
  /** An aggregate relationship */
  rocket_sensor_quats_aggregate: Rocket_Sensor_Quat_Aggregate;
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  z: Scalars['Float']['output'];
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorGpsVelsByVelocityArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorGpsVelsByVelocity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorImu1sByGyroscopesArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorImu1sByGyroscopes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorImu2sByDeltaVelocityArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorImu2sByDeltaVelocity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorNav1sByVelocityStdDevArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorNav1sByVelocityStdDev_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorNav2sByPositionStdDevArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3RocketSensorNav2sByPositionStdDev_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Gps_VelsArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Gps_Vels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Imu_1sArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Imu_1s_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Imu_2sArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Imu_2s_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Nav_1sArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Nav_1s_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Nav_2sArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Nav_2s_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_QuatsArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};


/** columns and relationships of "data_vec3" */
export type Data_Vec3Rocket_Sensor_Quats_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};

/** aggregated selection of "data_vec3" */
export type Data_Vec3_Aggregate = {
  __typename?: 'data_vec3_aggregate';
  aggregate?: Maybe<Data_Vec3_Aggregate_Fields>;
  nodes: Array<Data_Vec3>;
};

/** aggregate fields of "data_vec3" */
export type Data_Vec3_Aggregate_Fields = {
  __typename?: 'data_vec3_aggregate_fields';
  avg?: Maybe<Data_Vec3_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Data_Vec3_Max_Fields>;
  min?: Maybe<Data_Vec3_Min_Fields>;
  stddev?: Maybe<Data_Vec3_Stddev_Fields>;
  stddev_pop?: Maybe<Data_Vec3_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Data_Vec3_Stddev_Samp_Fields>;
  sum?: Maybe<Data_Vec3_Sum_Fields>;
  var_pop?: Maybe<Data_Vec3_Var_Pop_Fields>;
  var_samp?: Maybe<Data_Vec3_Var_Samp_Fields>;
  variance?: Maybe<Data_Vec3_Variance_Fields>;
};


/** aggregate fields of "data_vec3" */
export type Data_Vec3_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Data_Vec3_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Data_Vec3_Avg_Fields = {
  __typename?: 'data_vec3_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "data_vec3". All fields are combined with a logical 'AND'. */
export type Data_Vec3_Bool_Exp = {
  _and?: InputMaybe<Array<Data_Vec3_Bool_Exp>>;
  _not?: InputMaybe<Data_Vec3_Bool_Exp>;
  _or?: InputMaybe<Array<Data_Vec3_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  rocketSensorGpsVelsByVelocity?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
  rocketSensorGpsVelsByVelocity_aggregate?: InputMaybe<Rocket_Sensor_Gps_Vel_Aggregate_Bool_Exp>;
  rocketSensorImu1sByGyroscopes?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
  rocketSensorImu1sByGyroscopes_aggregate?: InputMaybe<Rocket_Sensor_Imu_1_Aggregate_Bool_Exp>;
  rocketSensorImu2sByDeltaVelocity?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
  rocketSensorImu2sByDeltaVelocity_aggregate?: InputMaybe<Rocket_Sensor_Imu_2_Aggregate_Bool_Exp>;
  rocketSensorNav1sByVelocityStdDev?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
  rocketSensorNav1sByVelocityStdDev_aggregate?: InputMaybe<Rocket_Sensor_Nav_1_Aggregate_Bool_Exp>;
  rocketSensorNav2sByPositionStdDev?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
  rocketSensorNav2sByPositionStdDev_aggregate?: InputMaybe<Rocket_Sensor_Nav_2_Aggregate_Bool_Exp>;
  rocket_sensor_gps_vels?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
  rocket_sensor_gps_vels_aggregate?: InputMaybe<Rocket_Sensor_Gps_Vel_Aggregate_Bool_Exp>;
  rocket_sensor_imu_1s?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
  rocket_sensor_imu_1s_aggregate?: InputMaybe<Rocket_Sensor_Imu_1_Aggregate_Bool_Exp>;
  rocket_sensor_imu_2s?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
  rocket_sensor_imu_2s_aggregate?: InputMaybe<Rocket_Sensor_Imu_2_Aggregate_Bool_Exp>;
  rocket_sensor_nav_1s?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
  rocket_sensor_nav_1s_aggregate?: InputMaybe<Rocket_Sensor_Nav_1_Aggregate_Bool_Exp>;
  rocket_sensor_nav_2s?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
  rocket_sensor_nav_2s_aggregate?: InputMaybe<Rocket_Sensor_Nav_2_Aggregate_Bool_Exp>;
  rocket_sensor_quats?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
  rocket_sensor_quats_aggregate?: InputMaybe<Rocket_Sensor_Quat_Aggregate_Bool_Exp>;
  x?: InputMaybe<Float_Comparison_Exp>;
  y?: InputMaybe<Float_Comparison_Exp>;
  z?: InputMaybe<Float_Comparison_Exp>;
};

/** unique or primary key constraints on table "data_vec3" */
export enum Data_Vec3_Constraint {
  /** unique or primary key constraint on columns "id" */
  DataVec3Pkey = 'data_vec3_pkey'
}

/** input type for incrementing numeric columns in table "data_vec3" */
export type Data_Vec3_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** input type for inserting data into table "data_vec3" */
export type Data_Vec3_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  rocketSensorGpsVelsByVelocity?: InputMaybe<Rocket_Sensor_Gps_Vel_Arr_Rel_Insert_Input>;
  rocketSensorImu1sByGyroscopes?: InputMaybe<Rocket_Sensor_Imu_1_Arr_Rel_Insert_Input>;
  rocketSensorImu2sByDeltaVelocity?: InputMaybe<Rocket_Sensor_Imu_2_Arr_Rel_Insert_Input>;
  rocketSensorNav1sByVelocityStdDev?: InputMaybe<Rocket_Sensor_Nav_1_Arr_Rel_Insert_Input>;
  rocketSensorNav2sByPositionStdDev?: InputMaybe<Rocket_Sensor_Nav_2_Arr_Rel_Insert_Input>;
  rocket_sensor_gps_vels?: InputMaybe<Rocket_Sensor_Gps_Vel_Arr_Rel_Insert_Input>;
  rocket_sensor_imu_1s?: InputMaybe<Rocket_Sensor_Imu_1_Arr_Rel_Insert_Input>;
  rocket_sensor_imu_2s?: InputMaybe<Rocket_Sensor_Imu_2_Arr_Rel_Insert_Input>;
  rocket_sensor_nav_1s?: InputMaybe<Rocket_Sensor_Nav_1_Arr_Rel_Insert_Input>;
  rocket_sensor_nav_2s?: InputMaybe<Rocket_Sensor_Nav_2_Arr_Rel_Insert_Input>;
  rocket_sensor_quats?: InputMaybe<Rocket_Sensor_Quat_Arr_Rel_Insert_Input>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate max on columns */
export type Data_Vec3_Max_Fields = {
  __typename?: 'data_vec3_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate min on columns */
export type Data_Vec3_Min_Fields = {
  __typename?: 'data_vec3_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** response of any mutation on the table "data_vec3" */
export type Data_Vec3_Mutation_Response = {
  __typename?: 'data_vec3_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Data_Vec3>;
};

/** input type for inserting object relation for remote table "data_vec3" */
export type Data_Vec3_Obj_Rel_Insert_Input = {
  data: Data_Vec3_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Data_Vec3_On_Conflict>;
};

/** on_conflict condition type for table "data_vec3" */
export type Data_Vec3_On_Conflict = {
  constraint: Data_Vec3_Constraint;
  update_columns?: Array<Data_Vec3_Update_Column>;
  where?: InputMaybe<Data_Vec3_Bool_Exp>;
};

/** Ordering options when selecting data from "data_vec3". */
export type Data_Vec3_Order_By = {
  id?: InputMaybe<Order_By>;
  rocketSensorGpsVelsByVelocity_aggregate?: InputMaybe<Rocket_Sensor_Gps_Vel_Aggregate_Order_By>;
  rocketSensorImu1sByGyroscopes_aggregate?: InputMaybe<Rocket_Sensor_Imu_1_Aggregate_Order_By>;
  rocketSensorImu2sByDeltaVelocity_aggregate?: InputMaybe<Rocket_Sensor_Imu_2_Aggregate_Order_By>;
  rocketSensorNav1sByVelocityStdDev_aggregate?: InputMaybe<Rocket_Sensor_Nav_1_Aggregate_Order_By>;
  rocketSensorNav2sByPositionStdDev_aggregate?: InputMaybe<Rocket_Sensor_Nav_2_Aggregate_Order_By>;
  rocket_sensor_gps_vels_aggregate?: InputMaybe<Rocket_Sensor_Gps_Vel_Aggregate_Order_By>;
  rocket_sensor_imu_1s_aggregate?: InputMaybe<Rocket_Sensor_Imu_1_Aggregate_Order_By>;
  rocket_sensor_imu_2s_aggregate?: InputMaybe<Rocket_Sensor_Imu_2_Aggregate_Order_By>;
  rocket_sensor_nav_1s_aggregate?: InputMaybe<Rocket_Sensor_Nav_1_Aggregate_Order_By>;
  rocket_sensor_nav_2s_aggregate?: InputMaybe<Rocket_Sensor_Nav_2_Aggregate_Order_By>;
  rocket_sensor_quats_aggregate?: InputMaybe<Rocket_Sensor_Quat_Aggregate_Order_By>;
  x?: InputMaybe<Order_By>;
  y?: InputMaybe<Order_By>;
  z?: InputMaybe<Order_By>;
};

/** primary key columns input for table: data_vec3 */
export type Data_Vec3_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "data_vec3" */
export enum Data_Vec3_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y',
  /** column name */
  Z = 'z'
}

/** input type for updating data in table "data_vec3" */
export type Data_Vec3_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate stddev on columns */
export type Data_Vec3_Stddev_Fields = {
  __typename?: 'data_vec3_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Data_Vec3_Stddev_Pop_Fields = {
  __typename?: 'data_vec3_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Data_Vec3_Stddev_Samp_Fields = {
  __typename?: 'data_vec3_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "data_vec3" */
export type Data_Vec3_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Data_Vec3_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Data_Vec3_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  z?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate sum on columns */
export type Data_Vec3_Sum_Fields = {
  __typename?: 'data_vec3_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** update columns of table "data_vec3" */
export enum Data_Vec3_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y',
  /** column name */
  Z = 'z'
}

export type Data_Vec3_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Data_Vec3_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Data_Vec3_Set_Input>;
  /** filter the rows which have to be updated */
  where: Data_Vec3_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Data_Vec3_Var_Pop_Fields = {
  __typename?: 'data_vec3_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Data_Vec3_Var_Samp_Fields = {
  __typename?: 'data_vec3_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Data_Vec3_Variance_Fields = {
  __typename?: 'data_vec3_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
  z?: Maybe<Scalars['Float']['output']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "data_quaternion" */
  delete_data_quaternion?: Maybe<Data_Quaternion_Mutation_Response>;
  /** delete single row from the table: "data_quaternion" */
  delete_data_quaternion_by_pk?: Maybe<Data_Quaternion>;
  /** delete data from the table: "data_vec3" */
  delete_data_vec3?: Maybe<Data_Vec3_Mutation_Response>;
  /** delete single row from the table: "data_vec3" */
  delete_data_vec3_by_pk?: Maybe<Data_Vec3>;
  /** delete data from the table: "rocket_command" */
  delete_rocket_command?: Maybe<Rocket_Command_Mutation_Response>;
  /** delete single row from the table: "rocket_command" */
  delete_rocket_command_by_pk?: Maybe<Rocket_Command>;
  /** delete data from the table: "rocket_deploy_drogue_command" */
  delete_rocket_deploy_drogue_command?: Maybe<Rocket_Deploy_Drogue_Command_Mutation_Response>;
  /** delete single row from the table: "rocket_deploy_drogue_command" */
  delete_rocket_deploy_drogue_command_by_pk?: Maybe<Rocket_Deploy_Drogue_Command>;
  /** delete data from the table: "rocket_deploy_main_command" */
  delete_rocket_deploy_main_command?: Maybe<Rocket_Deploy_Main_Command_Mutation_Response>;
  /** delete single row from the table: "rocket_deploy_main_command" */
  delete_rocket_deploy_main_command_by_pk?: Maybe<Rocket_Deploy_Main_Command>;
  /** delete data from the table: "rocket_health" */
  delete_rocket_health?: Maybe<Rocket_Health_Mutation_Response>;
  /** delete single row from the table: "rocket_health" */
  delete_rocket_health_by_pk?: Maybe<Rocket_Health>;
  /** delete data from the table: "rocket_health_status" */
  delete_rocket_health_status?: Maybe<Rocket_Health_Status_Mutation_Response>;
  /** delete single row from the table: "rocket_health_status" */
  delete_rocket_health_status_by_pk?: Maybe<Rocket_Health_Status>;
  /** delete data from the table: "rocket_heartbeat" */
  delete_rocket_heartbeat?: Maybe<Rocket_Heartbeat_Mutation_Response>;
  /** delete data from the table: "rocket_log" */
  delete_rocket_log?: Maybe<Rocket_Log_Mutation_Response>;
  /** delete single row from the table: "rocket_log" */
  delete_rocket_log_by_pk?: Maybe<Rocket_Log>;
  /** delete data from the table: "rocket_message" */
  delete_rocket_message?: Maybe<Rocket_Message_Mutation_Response>;
  /** delete single row from the table: "rocket_message" */
  delete_rocket_message_by_pk?: Maybe<Rocket_Message>;
  /** delete data from the table: "rocket_power_down_command" */
  delete_rocket_power_down_command?: Maybe<Rocket_Power_Down_Command_Mutation_Response>;
  /** delete single row from the table: "rocket_power_down_command" */
  delete_rocket_power_down_command_by_pk?: Maybe<Rocket_Power_Down_Command>;
  /** delete data from the table: "rocket_radio_rate_change_command" */
  delete_rocket_radio_rate_change_command?: Maybe<Rocket_Radio_Rate_Change_Command_Mutation_Response>;
  /** delete single row from the table: "rocket_radio_rate_change_command" */
  delete_rocket_radio_rate_change_command_by_pk?: Maybe<Rocket_Radio_Rate_Change_Command>;
  /** delete data from the table: "rocket_radio_status" */
  delete_rocket_radio_status?: Maybe<Rocket_Radio_Status_Mutation_Response>;
  /** delete data from the table: "rocket_sensor_air" */
  delete_rocket_sensor_air?: Maybe<Rocket_Sensor_Air_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_air" */
  delete_rocket_sensor_air_by_pk?: Maybe<Rocket_Sensor_Air>;
  /** delete data from the table: "rocket_sensor_gps_pos_1" */
  delete_rocket_sensor_gps_pos_1?: Maybe<Rocket_Sensor_Gps_Pos_1_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_gps_pos_1" */
  delete_rocket_sensor_gps_pos_1_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_1>;
  /** delete data from the table: "rocket_sensor_gps_pos_2" */
  delete_rocket_sensor_gps_pos_2?: Maybe<Rocket_Sensor_Gps_Pos_2_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_gps_pos_2" */
  delete_rocket_sensor_gps_pos_2_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_2>;
  /** delete data from the table: "rocket_sensor_gps_vel" */
  delete_rocket_sensor_gps_vel?: Maybe<Rocket_Sensor_Gps_Vel_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_gps_vel" */
  delete_rocket_sensor_gps_vel_by_pk?: Maybe<Rocket_Sensor_Gps_Vel>;
  /** delete data from the table: "rocket_sensor_imu_1" */
  delete_rocket_sensor_imu_1?: Maybe<Rocket_Sensor_Imu_1_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_imu_1" */
  delete_rocket_sensor_imu_1_by_pk?: Maybe<Rocket_Sensor_Imu_1>;
  /** delete data from the table: "rocket_sensor_imu_2" */
  delete_rocket_sensor_imu_2?: Maybe<Rocket_Sensor_Imu_2_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_imu_2" */
  delete_rocket_sensor_imu_2_by_pk?: Maybe<Rocket_Sensor_Imu_2>;
  /** delete data from the table: "rocket_sensor_message" */
  delete_rocket_sensor_message?: Maybe<Rocket_Sensor_Message_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_message" */
  delete_rocket_sensor_message_by_pk?: Maybe<Rocket_Sensor_Message>;
  /** delete data from the table: "rocket_sensor_nav_1" */
  delete_rocket_sensor_nav_1?: Maybe<Rocket_Sensor_Nav_1_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_nav_1" */
  delete_rocket_sensor_nav_1_by_pk?: Maybe<Rocket_Sensor_Nav_1>;
  /** delete data from the table: "rocket_sensor_nav_2" */
  delete_rocket_sensor_nav_2?: Maybe<Rocket_Sensor_Nav_2_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_nav_2" */
  delete_rocket_sensor_nav_2_by_pk?: Maybe<Rocket_Sensor_Nav_2>;
  /** delete data from the table: "rocket_sensor_quat" */
  delete_rocket_sensor_quat?: Maybe<Rocket_Sensor_Quat_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_quat" */
  delete_rocket_sensor_quat_by_pk?: Maybe<Rocket_Sensor_Quat>;
  /** delete data from the table: "rocket_sensor_utc_time" */
  delete_rocket_sensor_utc_time?: Maybe<Rocket_Sensor_Utc_Time_Mutation_Response>;
  /** delete single row from the table: "rocket_sensor_utc_time" */
  delete_rocket_sensor_utc_time_by_pk?: Maybe<Rocket_Sensor_Utc_Time>;
  /** delete data from the table: "rocket_state" */
  delete_rocket_state?: Maybe<Rocket_State_Mutation_Response>;
  /** delete single row from the table: "rocket_state" */
  delete_rocket_state_by_pk?: Maybe<Rocket_State>;
  /** insert data into the table: "data_quaternion" */
  insert_data_quaternion?: Maybe<Data_Quaternion_Mutation_Response>;
  /** insert a single row into the table: "data_quaternion" */
  insert_data_quaternion_one?: Maybe<Data_Quaternion>;
  /** insert data into the table: "data_vec3" */
  insert_data_vec3?: Maybe<Data_Vec3_Mutation_Response>;
  /** insert a single row into the table: "data_vec3" */
  insert_data_vec3_one?: Maybe<Data_Vec3>;
  /** insert data into the table: "rocket_command" */
  insert_rocket_command?: Maybe<Rocket_Command_Mutation_Response>;
  /** insert a single row into the table: "rocket_command" */
  insert_rocket_command_one?: Maybe<Rocket_Command>;
  /** insert data into the table: "rocket_deploy_drogue_command" */
  insert_rocket_deploy_drogue_command?: Maybe<Rocket_Deploy_Drogue_Command_Mutation_Response>;
  /** insert a single row into the table: "rocket_deploy_drogue_command" */
  insert_rocket_deploy_drogue_command_one?: Maybe<Rocket_Deploy_Drogue_Command>;
  /** insert data into the table: "rocket_deploy_main_command" */
  insert_rocket_deploy_main_command?: Maybe<Rocket_Deploy_Main_Command_Mutation_Response>;
  /** insert a single row into the table: "rocket_deploy_main_command" */
  insert_rocket_deploy_main_command_one?: Maybe<Rocket_Deploy_Main_Command>;
  /** insert data into the table: "rocket_health" */
  insert_rocket_health?: Maybe<Rocket_Health_Mutation_Response>;
  /** insert a single row into the table: "rocket_health" */
  insert_rocket_health_one?: Maybe<Rocket_Health>;
  /** insert data into the table: "rocket_health_status" */
  insert_rocket_health_status?: Maybe<Rocket_Health_Status_Mutation_Response>;
  /** insert a single row into the table: "rocket_health_status" */
  insert_rocket_health_status_one?: Maybe<Rocket_Health_Status>;
  /** insert data into the table: "rocket_heartbeat" */
  insert_rocket_heartbeat?: Maybe<Rocket_Heartbeat_Mutation_Response>;
  /** insert a single row into the table: "rocket_heartbeat" */
  insert_rocket_heartbeat_one?: Maybe<Rocket_Heartbeat>;
  /** insert data into the table: "rocket_log" */
  insert_rocket_log?: Maybe<Rocket_Log_Mutation_Response>;
  /** insert a single row into the table: "rocket_log" */
  insert_rocket_log_one?: Maybe<Rocket_Log>;
  /** insert data into the table: "rocket_message" */
  insert_rocket_message?: Maybe<Rocket_Message_Mutation_Response>;
  /** insert a single row into the table: "rocket_message" */
  insert_rocket_message_one?: Maybe<Rocket_Message>;
  /** insert data into the table: "rocket_power_down_command" */
  insert_rocket_power_down_command?: Maybe<Rocket_Power_Down_Command_Mutation_Response>;
  /** insert a single row into the table: "rocket_power_down_command" */
  insert_rocket_power_down_command_one?: Maybe<Rocket_Power_Down_Command>;
  /** insert data into the table: "rocket_radio_rate_change_command" */
  insert_rocket_radio_rate_change_command?: Maybe<Rocket_Radio_Rate_Change_Command_Mutation_Response>;
  /** insert a single row into the table: "rocket_radio_rate_change_command" */
  insert_rocket_radio_rate_change_command_one?: Maybe<Rocket_Radio_Rate_Change_Command>;
  /** insert data into the table: "rocket_radio_status" */
  insert_rocket_radio_status?: Maybe<Rocket_Radio_Status_Mutation_Response>;
  /** insert a single row into the table: "rocket_radio_status" */
  insert_rocket_radio_status_one?: Maybe<Rocket_Radio_Status>;
  /** insert data into the table: "rocket_sensor_air" */
  insert_rocket_sensor_air?: Maybe<Rocket_Sensor_Air_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_air" */
  insert_rocket_sensor_air_one?: Maybe<Rocket_Sensor_Air>;
  /** insert data into the table: "rocket_sensor_gps_pos_1" */
  insert_rocket_sensor_gps_pos_1?: Maybe<Rocket_Sensor_Gps_Pos_1_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_gps_pos_1" */
  insert_rocket_sensor_gps_pos_1_one?: Maybe<Rocket_Sensor_Gps_Pos_1>;
  /** insert data into the table: "rocket_sensor_gps_pos_2" */
  insert_rocket_sensor_gps_pos_2?: Maybe<Rocket_Sensor_Gps_Pos_2_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_gps_pos_2" */
  insert_rocket_sensor_gps_pos_2_one?: Maybe<Rocket_Sensor_Gps_Pos_2>;
  /** insert data into the table: "rocket_sensor_gps_vel" */
  insert_rocket_sensor_gps_vel?: Maybe<Rocket_Sensor_Gps_Vel_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_gps_vel" */
  insert_rocket_sensor_gps_vel_one?: Maybe<Rocket_Sensor_Gps_Vel>;
  /** insert data into the table: "rocket_sensor_imu_1" */
  insert_rocket_sensor_imu_1?: Maybe<Rocket_Sensor_Imu_1_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_imu_1" */
  insert_rocket_sensor_imu_1_one?: Maybe<Rocket_Sensor_Imu_1>;
  /** insert data into the table: "rocket_sensor_imu_2" */
  insert_rocket_sensor_imu_2?: Maybe<Rocket_Sensor_Imu_2_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_imu_2" */
  insert_rocket_sensor_imu_2_one?: Maybe<Rocket_Sensor_Imu_2>;
  /** insert data into the table: "rocket_sensor_message" */
  insert_rocket_sensor_message?: Maybe<Rocket_Sensor_Message_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_message" */
  insert_rocket_sensor_message_one?: Maybe<Rocket_Sensor_Message>;
  /** insert data into the table: "rocket_sensor_nav_1" */
  insert_rocket_sensor_nav_1?: Maybe<Rocket_Sensor_Nav_1_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_nav_1" */
  insert_rocket_sensor_nav_1_one?: Maybe<Rocket_Sensor_Nav_1>;
  /** insert data into the table: "rocket_sensor_nav_2" */
  insert_rocket_sensor_nav_2?: Maybe<Rocket_Sensor_Nav_2_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_nav_2" */
  insert_rocket_sensor_nav_2_one?: Maybe<Rocket_Sensor_Nav_2>;
  /** insert data into the table: "rocket_sensor_quat" */
  insert_rocket_sensor_quat?: Maybe<Rocket_Sensor_Quat_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_quat" */
  insert_rocket_sensor_quat_one?: Maybe<Rocket_Sensor_Quat>;
  /** insert data into the table: "rocket_sensor_utc_time" */
  insert_rocket_sensor_utc_time?: Maybe<Rocket_Sensor_Utc_Time_Mutation_Response>;
  /** insert a single row into the table: "rocket_sensor_utc_time" */
  insert_rocket_sensor_utc_time_one?: Maybe<Rocket_Sensor_Utc_Time>;
  /** insert data into the table: "rocket_state" */
  insert_rocket_state?: Maybe<Rocket_State_Mutation_Response>;
  /** insert a single row into the table: "rocket_state" */
  insert_rocket_state_one?: Maybe<Rocket_State>;
  /** update data of the table: "data_quaternion" */
  update_data_quaternion?: Maybe<Data_Quaternion_Mutation_Response>;
  /** update single row of the table: "data_quaternion" */
  update_data_quaternion_by_pk?: Maybe<Data_Quaternion>;
  /** update multiples rows of table: "data_quaternion" */
  update_data_quaternion_many?: Maybe<Array<Maybe<Data_Quaternion_Mutation_Response>>>;
  /** update data of the table: "data_vec3" */
  update_data_vec3?: Maybe<Data_Vec3_Mutation_Response>;
  /** update single row of the table: "data_vec3" */
  update_data_vec3_by_pk?: Maybe<Data_Vec3>;
  /** update multiples rows of table: "data_vec3" */
  update_data_vec3_many?: Maybe<Array<Maybe<Data_Vec3_Mutation_Response>>>;
  /** update data of the table: "rocket_command" */
  update_rocket_command?: Maybe<Rocket_Command_Mutation_Response>;
  /** update single row of the table: "rocket_command" */
  update_rocket_command_by_pk?: Maybe<Rocket_Command>;
  /** update multiples rows of table: "rocket_command" */
  update_rocket_command_many?: Maybe<Array<Maybe<Rocket_Command_Mutation_Response>>>;
  /** update data of the table: "rocket_deploy_drogue_command" */
  update_rocket_deploy_drogue_command?: Maybe<Rocket_Deploy_Drogue_Command_Mutation_Response>;
  /** update single row of the table: "rocket_deploy_drogue_command" */
  update_rocket_deploy_drogue_command_by_pk?: Maybe<Rocket_Deploy_Drogue_Command>;
  /** update multiples rows of table: "rocket_deploy_drogue_command" */
  update_rocket_deploy_drogue_command_many?: Maybe<Array<Maybe<Rocket_Deploy_Drogue_Command_Mutation_Response>>>;
  /** update data of the table: "rocket_deploy_main_command" */
  update_rocket_deploy_main_command?: Maybe<Rocket_Deploy_Main_Command_Mutation_Response>;
  /** update single row of the table: "rocket_deploy_main_command" */
  update_rocket_deploy_main_command_by_pk?: Maybe<Rocket_Deploy_Main_Command>;
  /** update multiples rows of table: "rocket_deploy_main_command" */
  update_rocket_deploy_main_command_many?: Maybe<Array<Maybe<Rocket_Deploy_Main_Command_Mutation_Response>>>;
  /** update data of the table: "rocket_health" */
  update_rocket_health?: Maybe<Rocket_Health_Mutation_Response>;
  /** update single row of the table: "rocket_health" */
  update_rocket_health_by_pk?: Maybe<Rocket_Health>;
  /** update multiples rows of table: "rocket_health" */
  update_rocket_health_many?: Maybe<Array<Maybe<Rocket_Health_Mutation_Response>>>;
  /** update data of the table: "rocket_health_status" */
  update_rocket_health_status?: Maybe<Rocket_Health_Status_Mutation_Response>;
  /** update single row of the table: "rocket_health_status" */
  update_rocket_health_status_by_pk?: Maybe<Rocket_Health_Status>;
  /** update multiples rows of table: "rocket_health_status" */
  update_rocket_health_status_many?: Maybe<Array<Maybe<Rocket_Health_Status_Mutation_Response>>>;
  /** update data of the table: "rocket_heartbeat" */
  update_rocket_heartbeat?: Maybe<Rocket_Heartbeat_Mutation_Response>;
  /** update multiples rows of table: "rocket_heartbeat" */
  update_rocket_heartbeat_many?: Maybe<Array<Maybe<Rocket_Heartbeat_Mutation_Response>>>;
  /** update data of the table: "rocket_log" */
  update_rocket_log?: Maybe<Rocket_Log_Mutation_Response>;
  /** update single row of the table: "rocket_log" */
  update_rocket_log_by_pk?: Maybe<Rocket_Log>;
  /** update multiples rows of table: "rocket_log" */
  update_rocket_log_many?: Maybe<Array<Maybe<Rocket_Log_Mutation_Response>>>;
  /** update data of the table: "rocket_message" */
  update_rocket_message?: Maybe<Rocket_Message_Mutation_Response>;
  /** update single row of the table: "rocket_message" */
  update_rocket_message_by_pk?: Maybe<Rocket_Message>;
  /** update multiples rows of table: "rocket_message" */
  update_rocket_message_many?: Maybe<Array<Maybe<Rocket_Message_Mutation_Response>>>;
  /** update data of the table: "rocket_power_down_command" */
  update_rocket_power_down_command?: Maybe<Rocket_Power_Down_Command_Mutation_Response>;
  /** update single row of the table: "rocket_power_down_command" */
  update_rocket_power_down_command_by_pk?: Maybe<Rocket_Power_Down_Command>;
  /** update multiples rows of table: "rocket_power_down_command" */
  update_rocket_power_down_command_many?: Maybe<Array<Maybe<Rocket_Power_Down_Command_Mutation_Response>>>;
  /** update data of the table: "rocket_radio_rate_change_command" */
  update_rocket_radio_rate_change_command?: Maybe<Rocket_Radio_Rate_Change_Command_Mutation_Response>;
  /** update single row of the table: "rocket_radio_rate_change_command" */
  update_rocket_radio_rate_change_command_by_pk?: Maybe<Rocket_Radio_Rate_Change_Command>;
  /** update multiples rows of table: "rocket_radio_rate_change_command" */
  update_rocket_radio_rate_change_command_many?: Maybe<Array<Maybe<Rocket_Radio_Rate_Change_Command_Mutation_Response>>>;
  /** update data of the table: "rocket_radio_status" */
  update_rocket_radio_status?: Maybe<Rocket_Radio_Status_Mutation_Response>;
  /** update multiples rows of table: "rocket_radio_status" */
  update_rocket_radio_status_many?: Maybe<Array<Maybe<Rocket_Radio_Status_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_air" */
  update_rocket_sensor_air?: Maybe<Rocket_Sensor_Air_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_air" */
  update_rocket_sensor_air_by_pk?: Maybe<Rocket_Sensor_Air>;
  /** update multiples rows of table: "rocket_sensor_air" */
  update_rocket_sensor_air_many?: Maybe<Array<Maybe<Rocket_Sensor_Air_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_gps_pos_1" */
  update_rocket_sensor_gps_pos_1?: Maybe<Rocket_Sensor_Gps_Pos_1_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_gps_pos_1" */
  update_rocket_sensor_gps_pos_1_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_1>;
  /** update multiples rows of table: "rocket_sensor_gps_pos_1" */
  update_rocket_sensor_gps_pos_1_many?: Maybe<Array<Maybe<Rocket_Sensor_Gps_Pos_1_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_gps_pos_2" */
  update_rocket_sensor_gps_pos_2?: Maybe<Rocket_Sensor_Gps_Pos_2_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_gps_pos_2" */
  update_rocket_sensor_gps_pos_2_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_2>;
  /** update multiples rows of table: "rocket_sensor_gps_pos_2" */
  update_rocket_sensor_gps_pos_2_many?: Maybe<Array<Maybe<Rocket_Sensor_Gps_Pos_2_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_gps_vel" */
  update_rocket_sensor_gps_vel?: Maybe<Rocket_Sensor_Gps_Vel_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_gps_vel" */
  update_rocket_sensor_gps_vel_by_pk?: Maybe<Rocket_Sensor_Gps_Vel>;
  /** update multiples rows of table: "rocket_sensor_gps_vel" */
  update_rocket_sensor_gps_vel_many?: Maybe<Array<Maybe<Rocket_Sensor_Gps_Vel_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_imu_1" */
  update_rocket_sensor_imu_1?: Maybe<Rocket_Sensor_Imu_1_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_imu_1" */
  update_rocket_sensor_imu_1_by_pk?: Maybe<Rocket_Sensor_Imu_1>;
  /** update multiples rows of table: "rocket_sensor_imu_1" */
  update_rocket_sensor_imu_1_many?: Maybe<Array<Maybe<Rocket_Sensor_Imu_1_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_imu_2" */
  update_rocket_sensor_imu_2?: Maybe<Rocket_Sensor_Imu_2_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_imu_2" */
  update_rocket_sensor_imu_2_by_pk?: Maybe<Rocket_Sensor_Imu_2>;
  /** update multiples rows of table: "rocket_sensor_imu_2" */
  update_rocket_sensor_imu_2_many?: Maybe<Array<Maybe<Rocket_Sensor_Imu_2_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_message" */
  update_rocket_sensor_message?: Maybe<Rocket_Sensor_Message_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_message" */
  update_rocket_sensor_message_by_pk?: Maybe<Rocket_Sensor_Message>;
  /** update multiples rows of table: "rocket_sensor_message" */
  update_rocket_sensor_message_many?: Maybe<Array<Maybe<Rocket_Sensor_Message_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_nav_1" */
  update_rocket_sensor_nav_1?: Maybe<Rocket_Sensor_Nav_1_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_nav_1" */
  update_rocket_sensor_nav_1_by_pk?: Maybe<Rocket_Sensor_Nav_1>;
  /** update multiples rows of table: "rocket_sensor_nav_1" */
  update_rocket_sensor_nav_1_many?: Maybe<Array<Maybe<Rocket_Sensor_Nav_1_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_nav_2" */
  update_rocket_sensor_nav_2?: Maybe<Rocket_Sensor_Nav_2_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_nav_2" */
  update_rocket_sensor_nav_2_by_pk?: Maybe<Rocket_Sensor_Nav_2>;
  /** update multiples rows of table: "rocket_sensor_nav_2" */
  update_rocket_sensor_nav_2_many?: Maybe<Array<Maybe<Rocket_Sensor_Nav_2_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_quat" */
  update_rocket_sensor_quat?: Maybe<Rocket_Sensor_Quat_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_quat" */
  update_rocket_sensor_quat_by_pk?: Maybe<Rocket_Sensor_Quat>;
  /** update multiples rows of table: "rocket_sensor_quat" */
  update_rocket_sensor_quat_many?: Maybe<Array<Maybe<Rocket_Sensor_Quat_Mutation_Response>>>;
  /** update data of the table: "rocket_sensor_utc_time" */
  update_rocket_sensor_utc_time?: Maybe<Rocket_Sensor_Utc_Time_Mutation_Response>;
  /** update single row of the table: "rocket_sensor_utc_time" */
  update_rocket_sensor_utc_time_by_pk?: Maybe<Rocket_Sensor_Utc_Time>;
  /** update multiples rows of table: "rocket_sensor_utc_time" */
  update_rocket_sensor_utc_time_many?: Maybe<Array<Maybe<Rocket_Sensor_Utc_Time_Mutation_Response>>>;
  /** update data of the table: "rocket_state" */
  update_rocket_state?: Maybe<Rocket_State_Mutation_Response>;
  /** update single row of the table: "rocket_state" */
  update_rocket_state_by_pk?: Maybe<Rocket_State>;
  /** update multiples rows of table: "rocket_state" */
  update_rocket_state_many?: Maybe<Array<Maybe<Rocket_State_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_Data_QuaternionArgs = {
  where: Data_Quaternion_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Data_Quaternion_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Data_Vec3Args = {
  where: Data_Vec3_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Data_Vec3_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_CommandArgs = {
  where: Rocket_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Command_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Deploy_Drogue_CommandArgs = {
  where: Rocket_Deploy_Drogue_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Deploy_Drogue_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Deploy_Main_CommandArgs = {
  where: Rocket_Deploy_Main_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Deploy_Main_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_HealthArgs = {
  where: Rocket_Health_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Health_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Health_StatusArgs = {
  where: Rocket_Health_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Health_Status_By_PkArgs = {
  rocket_health_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_HeartbeatArgs = {
  where: Rocket_Heartbeat_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_LogArgs = {
  where: Rocket_Log_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Log_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_MessageArgs = {
  where: Rocket_Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Message_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Power_Down_CommandArgs = {
  where: Rocket_Power_Down_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Power_Down_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Radio_Rate_Change_CommandArgs = {
  where: Rocket_Radio_Rate_Change_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Radio_Rate_Change_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Radio_StatusArgs = {
  where: Rocket_Radio_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_AirArgs = {
  where: Rocket_Sensor_Air_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Air_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Gps_Pos_1Args = {
  where: Rocket_Sensor_Gps_Pos_1_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Gps_Pos_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Gps_Pos_2Args = {
  where: Rocket_Sensor_Gps_Pos_2_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Gps_Pos_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Gps_VelArgs = {
  where: Rocket_Sensor_Gps_Vel_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Gps_Vel_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Imu_1Args = {
  where: Rocket_Sensor_Imu_1_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Imu_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Imu_2Args = {
  where: Rocket_Sensor_Imu_2_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Imu_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_MessageArgs = {
  where: Rocket_Sensor_Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Message_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Nav_1Args = {
  where: Rocket_Sensor_Nav_1_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Nav_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Nav_2Args = {
  where: Rocket_Sensor_Nav_2_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Nav_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_QuatArgs = {
  where: Rocket_Sensor_Quat_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Quat_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Utc_TimeArgs = {
  where: Rocket_Sensor_Utc_Time_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_Sensor_Utc_Time_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rocket_StateArgs = {
  where: Rocket_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rocket_State_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootInsert_Data_QuaternionArgs = {
  objects: Array<Data_Quaternion_Insert_Input>;
  on_conflict?: InputMaybe<Data_Quaternion_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Data_Quaternion_OneArgs = {
  object: Data_Quaternion_Insert_Input;
  on_conflict?: InputMaybe<Data_Quaternion_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Data_Vec3Args = {
  objects: Array<Data_Vec3_Insert_Input>;
  on_conflict?: InputMaybe<Data_Vec3_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Data_Vec3_OneArgs = {
  object: Data_Vec3_Insert_Input;
  on_conflict?: InputMaybe<Data_Vec3_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_CommandArgs = {
  objects: Array<Rocket_Command_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Command_OneArgs = {
  object: Rocket_Command_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Deploy_Drogue_CommandArgs = {
  objects: Array<Rocket_Deploy_Drogue_Command_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Deploy_Drogue_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Deploy_Drogue_Command_OneArgs = {
  object: Rocket_Deploy_Drogue_Command_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Deploy_Drogue_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Deploy_Main_CommandArgs = {
  objects: Array<Rocket_Deploy_Main_Command_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Deploy_Main_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Deploy_Main_Command_OneArgs = {
  object: Rocket_Deploy_Main_Command_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Deploy_Main_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_HealthArgs = {
  objects: Array<Rocket_Health_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Health_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Health_OneArgs = {
  object: Rocket_Health_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Health_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Health_StatusArgs = {
  objects: Array<Rocket_Health_Status_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Health_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Health_Status_OneArgs = {
  object: Rocket_Health_Status_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Health_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_HeartbeatArgs = {
  objects: Array<Rocket_Heartbeat_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Heartbeat_OneArgs = {
  object: Rocket_Heartbeat_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_LogArgs = {
  objects: Array<Rocket_Log_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Log_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Log_OneArgs = {
  object: Rocket_Log_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Log_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_MessageArgs = {
  objects: Array<Rocket_Message_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Message_OneArgs = {
  object: Rocket_Message_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Power_Down_CommandArgs = {
  objects: Array<Rocket_Power_Down_Command_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Power_Down_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Power_Down_Command_OneArgs = {
  object: Rocket_Power_Down_Command_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Power_Down_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Radio_Rate_Change_CommandArgs = {
  objects: Array<Rocket_Radio_Rate_Change_Command_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Radio_Rate_Change_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Radio_Rate_Change_Command_OneArgs = {
  object: Rocket_Radio_Rate_Change_Command_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Radio_Rate_Change_Command_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Radio_StatusArgs = {
  objects: Array<Rocket_Radio_Status_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Radio_Status_OneArgs = {
  object: Rocket_Radio_Status_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_AirArgs = {
  objects: Array<Rocket_Sensor_Air_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Air_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Air_OneArgs = {
  object: Rocket_Sensor_Air_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Air_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Gps_Pos_1Args = {
  objects: Array<Rocket_Sensor_Gps_Pos_1_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Pos_1_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Gps_Pos_1_OneArgs = {
  object: Rocket_Sensor_Gps_Pos_1_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Pos_1_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Gps_Pos_2Args = {
  objects: Array<Rocket_Sensor_Gps_Pos_2_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Pos_2_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Gps_Pos_2_OneArgs = {
  object: Rocket_Sensor_Gps_Pos_2_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Pos_2_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Gps_VelArgs = {
  objects: Array<Rocket_Sensor_Gps_Vel_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Vel_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Gps_Vel_OneArgs = {
  object: Rocket_Sensor_Gps_Vel_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Vel_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Imu_1Args = {
  objects: Array<Rocket_Sensor_Imu_1_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_1_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Imu_1_OneArgs = {
  object: Rocket_Sensor_Imu_1_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_1_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Imu_2Args = {
  objects: Array<Rocket_Sensor_Imu_2_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_2_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Imu_2_OneArgs = {
  object: Rocket_Sensor_Imu_2_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_2_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_MessageArgs = {
  objects: Array<Rocket_Sensor_Message_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Message_OneArgs = {
  object: Rocket_Sensor_Message_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Nav_1Args = {
  objects: Array<Rocket_Sensor_Nav_1_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_1_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Nav_1_OneArgs = {
  object: Rocket_Sensor_Nav_1_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_1_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Nav_2Args = {
  objects: Array<Rocket_Sensor_Nav_2_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_2_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Nav_2_OneArgs = {
  object: Rocket_Sensor_Nav_2_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_2_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_QuatArgs = {
  objects: Array<Rocket_Sensor_Quat_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Quat_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Quat_OneArgs = {
  object: Rocket_Sensor_Quat_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Quat_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Utc_TimeArgs = {
  objects: Array<Rocket_Sensor_Utc_Time_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_Sensor_Utc_Time_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_Sensor_Utc_Time_OneArgs = {
  object: Rocket_Sensor_Utc_Time_Insert_Input;
  on_conflict?: InputMaybe<Rocket_Sensor_Utc_Time_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_StateArgs = {
  objects: Array<Rocket_State_Insert_Input>;
  on_conflict?: InputMaybe<Rocket_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rocket_State_OneArgs = {
  object: Rocket_State_Insert_Input;
  on_conflict?: InputMaybe<Rocket_State_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Data_QuaternionArgs = {
  _inc?: InputMaybe<Data_Quaternion_Inc_Input>;
  _set?: InputMaybe<Data_Quaternion_Set_Input>;
  where: Data_Quaternion_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Data_Quaternion_By_PkArgs = {
  _inc?: InputMaybe<Data_Quaternion_Inc_Input>;
  _set?: InputMaybe<Data_Quaternion_Set_Input>;
  pk_columns: Data_Quaternion_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Data_Quaternion_ManyArgs = {
  updates: Array<Data_Quaternion_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Data_Vec3Args = {
  _inc?: InputMaybe<Data_Vec3_Inc_Input>;
  _set?: InputMaybe<Data_Vec3_Set_Input>;
  where: Data_Vec3_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Data_Vec3_By_PkArgs = {
  _inc?: InputMaybe<Data_Vec3_Inc_Input>;
  _set?: InputMaybe<Data_Vec3_Set_Input>;
  pk_columns: Data_Vec3_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Data_Vec3_ManyArgs = {
  updates: Array<Data_Vec3_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_CommandArgs = {
  _inc?: InputMaybe<Rocket_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Command_Set_Input>;
  where: Rocket_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Command_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Command_Set_Input>;
  pk_columns: Rocket_Command_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Command_ManyArgs = {
  updates: Array<Rocket_Command_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Deploy_Drogue_CommandArgs = {
  _inc?: InputMaybe<Rocket_Deploy_Drogue_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Deploy_Drogue_Command_Set_Input>;
  where: Rocket_Deploy_Drogue_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Deploy_Drogue_Command_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Deploy_Drogue_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Deploy_Drogue_Command_Set_Input>;
  pk_columns: Rocket_Deploy_Drogue_Command_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Deploy_Drogue_Command_ManyArgs = {
  updates: Array<Rocket_Deploy_Drogue_Command_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Deploy_Main_CommandArgs = {
  _inc?: InputMaybe<Rocket_Deploy_Main_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Deploy_Main_Command_Set_Input>;
  where: Rocket_Deploy_Main_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Deploy_Main_Command_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Deploy_Main_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Deploy_Main_Command_Set_Input>;
  pk_columns: Rocket_Deploy_Main_Command_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Deploy_Main_Command_ManyArgs = {
  updates: Array<Rocket_Deploy_Main_Command_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_HealthArgs = {
  _inc?: InputMaybe<Rocket_Health_Inc_Input>;
  _set?: InputMaybe<Rocket_Health_Set_Input>;
  where: Rocket_Health_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Health_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Health_Inc_Input>;
  _set?: InputMaybe<Rocket_Health_Set_Input>;
  pk_columns: Rocket_Health_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Health_ManyArgs = {
  updates: Array<Rocket_Health_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Health_StatusArgs = {
  _inc?: InputMaybe<Rocket_Health_Status_Inc_Input>;
  _set?: InputMaybe<Rocket_Health_Status_Set_Input>;
  where: Rocket_Health_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Health_Status_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Health_Status_Inc_Input>;
  _set?: InputMaybe<Rocket_Health_Status_Set_Input>;
  pk_columns: Rocket_Health_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Health_Status_ManyArgs = {
  updates: Array<Rocket_Health_Status_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_HeartbeatArgs = {
  _inc?: InputMaybe<Rocket_Heartbeat_Inc_Input>;
  _set?: InputMaybe<Rocket_Heartbeat_Set_Input>;
  where: Rocket_Heartbeat_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Heartbeat_ManyArgs = {
  updates: Array<Rocket_Heartbeat_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_LogArgs = {
  _inc?: InputMaybe<Rocket_Log_Inc_Input>;
  _set?: InputMaybe<Rocket_Log_Set_Input>;
  where: Rocket_Log_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Log_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Log_Inc_Input>;
  _set?: InputMaybe<Rocket_Log_Set_Input>;
  pk_columns: Rocket_Log_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Log_ManyArgs = {
  updates: Array<Rocket_Log_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_MessageArgs = {
  _inc?: InputMaybe<Rocket_Message_Inc_Input>;
  _set?: InputMaybe<Rocket_Message_Set_Input>;
  where: Rocket_Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Message_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Message_Inc_Input>;
  _set?: InputMaybe<Rocket_Message_Set_Input>;
  pk_columns: Rocket_Message_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Message_ManyArgs = {
  updates: Array<Rocket_Message_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Power_Down_CommandArgs = {
  _inc?: InputMaybe<Rocket_Power_Down_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Power_Down_Command_Set_Input>;
  where: Rocket_Power_Down_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Power_Down_Command_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Power_Down_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Power_Down_Command_Set_Input>;
  pk_columns: Rocket_Power_Down_Command_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Power_Down_Command_ManyArgs = {
  updates: Array<Rocket_Power_Down_Command_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Radio_Rate_Change_CommandArgs = {
  _inc?: InputMaybe<Rocket_Radio_Rate_Change_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Radio_Rate_Change_Command_Set_Input>;
  where: Rocket_Radio_Rate_Change_Command_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Radio_Rate_Change_Command_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Radio_Rate_Change_Command_Inc_Input>;
  _set?: InputMaybe<Rocket_Radio_Rate_Change_Command_Set_Input>;
  pk_columns: Rocket_Radio_Rate_Change_Command_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Radio_Rate_Change_Command_ManyArgs = {
  updates: Array<Rocket_Radio_Rate_Change_Command_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Radio_StatusArgs = {
  _inc?: InputMaybe<Rocket_Radio_Status_Inc_Input>;
  _set?: InputMaybe<Rocket_Radio_Status_Set_Input>;
  where: Rocket_Radio_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Radio_Status_ManyArgs = {
  updates: Array<Rocket_Radio_Status_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_AirArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Air_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Air_Set_Input>;
  where: Rocket_Sensor_Air_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Air_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Air_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Air_Set_Input>;
  pk_columns: Rocket_Sensor_Air_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Air_ManyArgs = {
  updates: Array<Rocket_Sensor_Air_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Pos_1Args = {
  _inc?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Set_Input>;
  where: Rocket_Sensor_Gps_Pos_1_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Pos_1_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Set_Input>;
  pk_columns: Rocket_Sensor_Gps_Pos_1_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Pos_1_ManyArgs = {
  updates: Array<Rocket_Sensor_Gps_Pos_1_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Pos_2Args = {
  _inc?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Set_Input>;
  where: Rocket_Sensor_Gps_Pos_2_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Pos_2_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Set_Input>;
  pk_columns: Rocket_Sensor_Gps_Pos_2_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Pos_2_ManyArgs = {
  updates: Array<Rocket_Sensor_Gps_Pos_2_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_VelArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Gps_Vel_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Gps_Vel_Set_Input>;
  where: Rocket_Sensor_Gps_Vel_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Vel_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Gps_Vel_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Gps_Vel_Set_Input>;
  pk_columns: Rocket_Sensor_Gps_Vel_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Gps_Vel_ManyArgs = {
  updates: Array<Rocket_Sensor_Gps_Vel_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Imu_1Args = {
  _inc?: InputMaybe<Rocket_Sensor_Imu_1_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Imu_1_Set_Input>;
  where: Rocket_Sensor_Imu_1_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Imu_1_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Imu_1_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Imu_1_Set_Input>;
  pk_columns: Rocket_Sensor_Imu_1_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Imu_1_ManyArgs = {
  updates: Array<Rocket_Sensor_Imu_1_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Imu_2Args = {
  _inc?: InputMaybe<Rocket_Sensor_Imu_2_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Imu_2_Set_Input>;
  where: Rocket_Sensor_Imu_2_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Imu_2_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Imu_2_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Imu_2_Set_Input>;
  pk_columns: Rocket_Sensor_Imu_2_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Imu_2_ManyArgs = {
  updates: Array<Rocket_Sensor_Imu_2_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_MessageArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Message_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Message_Set_Input>;
  where: Rocket_Sensor_Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Message_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Message_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Message_Set_Input>;
  pk_columns: Rocket_Sensor_Message_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Message_ManyArgs = {
  updates: Array<Rocket_Sensor_Message_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Nav_1Args = {
  _inc?: InputMaybe<Rocket_Sensor_Nav_1_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Nav_1_Set_Input>;
  where: Rocket_Sensor_Nav_1_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Nav_1_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Nav_1_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Nav_1_Set_Input>;
  pk_columns: Rocket_Sensor_Nav_1_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Nav_1_ManyArgs = {
  updates: Array<Rocket_Sensor_Nav_1_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Nav_2Args = {
  _inc?: InputMaybe<Rocket_Sensor_Nav_2_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Nav_2_Set_Input>;
  where: Rocket_Sensor_Nav_2_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Nav_2_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Nav_2_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Nav_2_Set_Input>;
  pk_columns: Rocket_Sensor_Nav_2_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Nav_2_ManyArgs = {
  updates: Array<Rocket_Sensor_Nav_2_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_QuatArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Quat_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Quat_Set_Input>;
  where: Rocket_Sensor_Quat_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Quat_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Quat_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Quat_Set_Input>;
  pk_columns: Rocket_Sensor_Quat_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Quat_ManyArgs = {
  updates: Array<Rocket_Sensor_Quat_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Utc_TimeArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Utc_Time_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Utc_Time_Set_Input>;
  where: Rocket_Sensor_Utc_Time_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Utc_Time_By_PkArgs = {
  _inc?: InputMaybe<Rocket_Sensor_Utc_Time_Inc_Input>;
  _set?: InputMaybe<Rocket_Sensor_Utc_Time_Set_Input>;
  pk_columns: Rocket_Sensor_Utc_Time_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_Sensor_Utc_Time_ManyArgs = {
  updates: Array<Rocket_Sensor_Utc_Time_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_StateArgs = {
  _inc?: InputMaybe<Rocket_State_Inc_Input>;
  _set?: InputMaybe<Rocket_State_Set_Input>;
  where: Rocket_State_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_State_By_PkArgs = {
  _inc?: InputMaybe<Rocket_State_Inc_Input>;
  _set?: InputMaybe<Rocket_State_Set_Input>;
  pk_columns: Rocket_State_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rocket_State_ManyArgs = {
  updates: Array<Rocket_State_Updates>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "data_quaternion" */
  data_quaternion: Array<Data_Quaternion>;
  /** fetch aggregated fields from the table: "data_quaternion" */
  data_quaternion_aggregate: Data_Quaternion_Aggregate;
  /** fetch data from the table: "data_quaternion" using primary key columns */
  data_quaternion_by_pk?: Maybe<Data_Quaternion>;
  /** fetch data from the table: "data_vec3" */
  data_vec3: Array<Data_Vec3>;
  /** fetch aggregated fields from the table: "data_vec3" */
  data_vec3_aggregate: Data_Vec3_Aggregate;
  /** fetch data from the table: "data_vec3" using primary key columns */
  data_vec3_by_pk?: Maybe<Data_Vec3>;
  /** fetch data from the table: "rocket_command" */
  rocket_command: Array<Rocket_Command>;
  /** fetch aggregated fields from the table: "rocket_command" */
  rocket_command_aggregate: Rocket_Command_Aggregate;
  /** fetch data from the table: "rocket_command" using primary key columns */
  rocket_command_by_pk?: Maybe<Rocket_Command>;
  /** fetch data from the table: "rocket_deploy_drogue_command" */
  rocket_deploy_drogue_command: Array<Rocket_Deploy_Drogue_Command>;
  /** fetch aggregated fields from the table: "rocket_deploy_drogue_command" */
  rocket_deploy_drogue_command_aggregate: Rocket_Deploy_Drogue_Command_Aggregate;
  /** fetch data from the table: "rocket_deploy_drogue_command" using primary key columns */
  rocket_deploy_drogue_command_by_pk?: Maybe<Rocket_Deploy_Drogue_Command>;
  /** fetch data from the table: "rocket_deploy_main_command" */
  rocket_deploy_main_command: Array<Rocket_Deploy_Main_Command>;
  /** fetch aggregated fields from the table: "rocket_deploy_main_command" */
  rocket_deploy_main_command_aggregate: Rocket_Deploy_Main_Command_Aggregate;
  /** fetch data from the table: "rocket_deploy_main_command" using primary key columns */
  rocket_deploy_main_command_by_pk?: Maybe<Rocket_Deploy_Main_Command>;
  /** fetch data from the table: "rocket_health" */
  rocket_health: Array<Rocket_Health>;
  /** fetch aggregated fields from the table: "rocket_health" */
  rocket_health_aggregate: Rocket_Health_Aggregate;
  /** fetch data from the table: "rocket_health" using primary key columns */
  rocket_health_by_pk?: Maybe<Rocket_Health>;
  /** fetch data from the table: "rocket_health_status" */
  rocket_health_status: Array<Rocket_Health_Status>;
  /** fetch aggregated fields from the table: "rocket_health_status" */
  rocket_health_status_aggregate: Rocket_Health_Status_Aggregate;
  /** fetch data from the table: "rocket_health_status" using primary key columns */
  rocket_health_status_by_pk?: Maybe<Rocket_Health_Status>;
  /** fetch data from the table: "rocket_heartbeat" */
  rocket_heartbeat: Array<Rocket_Heartbeat>;
  /** fetch aggregated fields from the table: "rocket_heartbeat" */
  rocket_heartbeat_aggregate: Rocket_Heartbeat_Aggregate;
  /** fetch data from the table: "rocket_log" */
  rocket_log: Array<Rocket_Log>;
  /** fetch aggregated fields from the table: "rocket_log" */
  rocket_log_aggregate: Rocket_Log_Aggregate;
  /** fetch data from the table: "rocket_log" using primary key columns */
  rocket_log_by_pk?: Maybe<Rocket_Log>;
  /** fetch data from the table: "rocket_message" */
  rocket_message: Array<Rocket_Message>;
  /** fetch aggregated fields from the table: "rocket_message" */
  rocket_message_aggregate: Rocket_Message_Aggregate;
  /** fetch data from the table: "rocket_message" using primary key columns */
  rocket_message_by_pk?: Maybe<Rocket_Message>;
  /** fetch data from the table: "rocket_power_down_command" */
  rocket_power_down_command: Array<Rocket_Power_Down_Command>;
  /** fetch aggregated fields from the table: "rocket_power_down_command" */
  rocket_power_down_command_aggregate: Rocket_Power_Down_Command_Aggregate;
  /** fetch data from the table: "rocket_power_down_command" using primary key columns */
  rocket_power_down_command_by_pk?: Maybe<Rocket_Power_Down_Command>;
  /** fetch data from the table: "rocket_radio_rate_change_command" */
  rocket_radio_rate_change_command: Array<Rocket_Radio_Rate_Change_Command>;
  /** fetch aggregated fields from the table: "rocket_radio_rate_change_command" */
  rocket_radio_rate_change_command_aggregate: Rocket_Radio_Rate_Change_Command_Aggregate;
  /** fetch data from the table: "rocket_radio_rate_change_command" using primary key columns */
  rocket_radio_rate_change_command_by_pk?: Maybe<Rocket_Radio_Rate_Change_Command>;
  /** fetch data from the table: "rocket_radio_status" */
  rocket_radio_status: Array<Rocket_Radio_Status>;
  /** fetch aggregated fields from the table: "rocket_radio_status" */
  rocket_radio_status_aggregate: Rocket_Radio_Status_Aggregate;
  /** fetch data from the table: "rocket_sensor_air" */
  rocket_sensor_air: Array<Rocket_Sensor_Air>;
  /** fetch aggregated fields from the table: "rocket_sensor_air" */
  rocket_sensor_air_aggregate: Rocket_Sensor_Air_Aggregate;
  /** fetch data from the table: "rocket_sensor_air" using primary key columns */
  rocket_sensor_air_by_pk?: Maybe<Rocket_Sensor_Air>;
  /** fetch data from the table: "rocket_sensor_gps_pos_1" */
  rocket_sensor_gps_pos_1: Array<Rocket_Sensor_Gps_Pos_1>;
  /** fetch aggregated fields from the table: "rocket_sensor_gps_pos_1" */
  rocket_sensor_gps_pos_1_aggregate: Rocket_Sensor_Gps_Pos_1_Aggregate;
  /** fetch data from the table: "rocket_sensor_gps_pos_1" using primary key columns */
  rocket_sensor_gps_pos_1_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_1>;
  /** fetch data from the table: "rocket_sensor_gps_pos_2" */
  rocket_sensor_gps_pos_2: Array<Rocket_Sensor_Gps_Pos_2>;
  /** fetch aggregated fields from the table: "rocket_sensor_gps_pos_2" */
  rocket_sensor_gps_pos_2_aggregate: Rocket_Sensor_Gps_Pos_2_Aggregate;
  /** fetch data from the table: "rocket_sensor_gps_pos_2" using primary key columns */
  rocket_sensor_gps_pos_2_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_2>;
  /** fetch data from the table: "rocket_sensor_gps_vel" */
  rocket_sensor_gps_vel: Array<Rocket_Sensor_Gps_Vel>;
  /** fetch aggregated fields from the table: "rocket_sensor_gps_vel" */
  rocket_sensor_gps_vel_aggregate: Rocket_Sensor_Gps_Vel_Aggregate;
  /** fetch data from the table: "rocket_sensor_gps_vel" using primary key columns */
  rocket_sensor_gps_vel_by_pk?: Maybe<Rocket_Sensor_Gps_Vel>;
  /** fetch data from the table: "rocket_sensor_imu_1" */
  rocket_sensor_imu_1: Array<Rocket_Sensor_Imu_1>;
  /** fetch aggregated fields from the table: "rocket_sensor_imu_1" */
  rocket_sensor_imu_1_aggregate: Rocket_Sensor_Imu_1_Aggregate;
  /** fetch data from the table: "rocket_sensor_imu_1" using primary key columns */
  rocket_sensor_imu_1_by_pk?: Maybe<Rocket_Sensor_Imu_1>;
  /** fetch data from the table: "rocket_sensor_imu_2" */
  rocket_sensor_imu_2: Array<Rocket_Sensor_Imu_2>;
  /** fetch aggregated fields from the table: "rocket_sensor_imu_2" */
  rocket_sensor_imu_2_aggregate: Rocket_Sensor_Imu_2_Aggregate;
  /** fetch data from the table: "rocket_sensor_imu_2" using primary key columns */
  rocket_sensor_imu_2_by_pk?: Maybe<Rocket_Sensor_Imu_2>;
  /** fetch data from the table: "rocket_sensor_message" */
  rocket_sensor_message: Array<Rocket_Sensor_Message>;
  /** fetch aggregated fields from the table: "rocket_sensor_message" */
  rocket_sensor_message_aggregate: Rocket_Sensor_Message_Aggregate;
  /** fetch data from the table: "rocket_sensor_message" using primary key columns */
  rocket_sensor_message_by_pk?: Maybe<Rocket_Sensor_Message>;
  /** fetch data from the table: "rocket_sensor_nav_1" */
  rocket_sensor_nav_1: Array<Rocket_Sensor_Nav_1>;
  /** fetch aggregated fields from the table: "rocket_sensor_nav_1" */
  rocket_sensor_nav_1_aggregate: Rocket_Sensor_Nav_1_Aggregate;
  /** fetch data from the table: "rocket_sensor_nav_1" using primary key columns */
  rocket_sensor_nav_1_by_pk?: Maybe<Rocket_Sensor_Nav_1>;
  /** fetch data from the table: "rocket_sensor_nav_2" */
  rocket_sensor_nav_2: Array<Rocket_Sensor_Nav_2>;
  /** fetch aggregated fields from the table: "rocket_sensor_nav_2" */
  rocket_sensor_nav_2_aggregate: Rocket_Sensor_Nav_2_Aggregate;
  /** fetch data from the table: "rocket_sensor_nav_2" using primary key columns */
  rocket_sensor_nav_2_by_pk?: Maybe<Rocket_Sensor_Nav_2>;
  /** fetch data from the table: "rocket_sensor_quat" */
  rocket_sensor_quat: Array<Rocket_Sensor_Quat>;
  /** fetch aggregated fields from the table: "rocket_sensor_quat" */
  rocket_sensor_quat_aggregate: Rocket_Sensor_Quat_Aggregate;
  /** fetch data from the table: "rocket_sensor_quat" using primary key columns */
  rocket_sensor_quat_by_pk?: Maybe<Rocket_Sensor_Quat>;
  /** fetch data from the table: "rocket_sensor_utc_time" */
  rocket_sensor_utc_time: Array<Rocket_Sensor_Utc_Time>;
  /** fetch aggregated fields from the table: "rocket_sensor_utc_time" */
  rocket_sensor_utc_time_aggregate: Rocket_Sensor_Utc_Time_Aggregate;
  /** fetch data from the table: "rocket_sensor_utc_time" using primary key columns */
  rocket_sensor_utc_time_by_pk?: Maybe<Rocket_Sensor_Utc_Time>;
  /** fetch data from the table: "rocket_state" */
  rocket_state: Array<Rocket_State>;
  /** fetch aggregated fields from the table: "rocket_state" */
  rocket_state_aggregate: Rocket_State_Aggregate;
  /** fetch data from the table: "rocket_state" using primary key columns */
  rocket_state_by_pk?: Maybe<Rocket_State>;
};


export type Query_RootData_QuaternionArgs = {
  distinct_on?: InputMaybe<Array<Data_Quaternion_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Quaternion_Order_By>>;
  where?: InputMaybe<Data_Quaternion_Bool_Exp>;
};


export type Query_RootData_Quaternion_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Data_Quaternion_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Quaternion_Order_By>>;
  where?: InputMaybe<Data_Quaternion_Bool_Exp>;
};


export type Query_RootData_Quaternion_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootData_Vec3Args = {
  distinct_on?: InputMaybe<Array<Data_Vec3_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Vec3_Order_By>>;
  where?: InputMaybe<Data_Vec3_Bool_Exp>;
};


export type Query_RootData_Vec3_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Data_Vec3_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Vec3_Order_By>>;
  where?: InputMaybe<Data_Vec3_Bool_Exp>;
};


export type Query_RootData_Vec3_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootRocket_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Command_Order_By>>;
  where?: InputMaybe<Rocket_Command_Bool_Exp>;
};


export type Query_RootRocket_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Command_Order_By>>;
  where?: InputMaybe<Rocket_Command_Bool_Exp>;
};


export type Query_RootRocket_Command_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Deploy_Drogue_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
};


export type Query_RootRocket_Deploy_Drogue_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
};


export type Query_RootRocket_Deploy_Drogue_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Deploy_Main_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Main_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Main_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
};


export type Query_RootRocket_Deploy_Main_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Main_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Main_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
};


export type Query_RootRocket_Deploy_Main_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Query_RootRocket_HealthArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Order_By>>;
  where?: InputMaybe<Rocket_Health_Bool_Exp>;
};


export type Query_RootRocket_Health_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Order_By>>;
  where?: InputMaybe<Rocket_Health_Bool_Exp>;
};


export type Query_RootRocket_Health_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Health_StatusArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Status_Order_By>>;
  where?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
};


export type Query_RootRocket_Health_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Status_Order_By>>;
  where?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
};


export type Query_RootRocket_Health_Status_By_PkArgs = {
  rocket_health_id: Scalars['Int']['input'];
};


export type Query_RootRocket_HeartbeatArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Heartbeat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Heartbeat_Order_By>>;
  where?: InputMaybe<Rocket_Heartbeat_Bool_Exp>;
};


export type Query_RootRocket_Heartbeat_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Heartbeat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Heartbeat_Order_By>>;
  where?: InputMaybe<Rocket_Heartbeat_Bool_Exp>;
};


export type Query_RootRocket_LogArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Log_Order_By>>;
  where?: InputMaybe<Rocket_Log_Bool_Exp>;
};


export type Query_RootRocket_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Log_Order_By>>;
  where?: InputMaybe<Rocket_Log_Bool_Exp>;
};


export type Query_RootRocket_Log_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_MessageArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Message_Order_By>>;
  where?: InputMaybe<Rocket_Message_Bool_Exp>;
};


export type Query_RootRocket_Message_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Message_Order_By>>;
  where?: InputMaybe<Rocket_Message_Bool_Exp>;
};


export type Query_RootRocket_Message_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootRocket_Power_Down_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Power_Down_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Power_Down_Command_Order_By>>;
  where?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
};


export type Query_RootRocket_Power_Down_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Power_Down_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Power_Down_Command_Order_By>>;
  where?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
};


export type Query_RootRocket_Power_Down_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Radio_Rate_Change_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
};


export type Query_RootRocket_Radio_Rate_Change_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
};


export type Query_RootRocket_Radio_Rate_Change_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Radio_StatusArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Status_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Status_Bool_Exp>;
};


export type Query_RootRocket_Radio_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Status_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Status_Bool_Exp>;
};


export type Query_RootRocket_Sensor_AirArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Air_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Air_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Air_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Air_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Air_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Air_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Gps_Pos_1Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Gps_Pos_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Gps_Pos_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Gps_Pos_2Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Gps_Pos_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Gps_Pos_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Gps_VelArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Gps_Vel_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Gps_Vel_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Imu_1Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Imu_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Imu_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Imu_2Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Imu_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Imu_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_MessageArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Message_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Message_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Message_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Message_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Nav_1Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Nav_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Nav_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Nav_2Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Nav_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Nav_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_QuatArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Quat_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Quat_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_Sensor_Utc_TimeArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Utc_Time_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
};


export type Query_RootRocket_Sensor_Utc_Time_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Query_RootRocket_StateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_State_Order_By>>;
  where?: InputMaybe<Rocket_State_Bool_Exp>;
};


export type Query_RootRocket_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_State_Order_By>>;
  where?: InputMaybe<Rocket_State_Bool_Exp>;
};


export type Query_RootRocket_State_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};

/** columns and relationships of "rocket_command" */
export type Rocket_Command = {
  __typename?: 'rocket_command';
  /** An object relationship */
  rocket_deploy_drogue_command?: Maybe<Rocket_Deploy_Drogue_Command>;
  /** An object relationship */
  rocket_deploy_main_command?: Maybe<Rocket_Deploy_Main_Command>;
  /** An object relationship */
  rocket_message: Rocket_Message;
  rocket_message_id: Scalars['Int']['output'];
  /** An object relationship */
  rocket_power_down_command?: Maybe<Rocket_Power_Down_Command>;
  /** An object relationship */
  rocket_radio_rate_change_command?: Maybe<Rocket_Radio_Rate_Change_Command>;
};

/** aggregated selection of "rocket_command" */
export type Rocket_Command_Aggregate = {
  __typename?: 'rocket_command_aggregate';
  aggregate?: Maybe<Rocket_Command_Aggregate_Fields>;
  nodes: Array<Rocket_Command>;
};

/** aggregate fields of "rocket_command" */
export type Rocket_Command_Aggregate_Fields = {
  __typename?: 'rocket_command_aggregate_fields';
  avg?: Maybe<Rocket_Command_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Command_Max_Fields>;
  min?: Maybe<Rocket_Command_Min_Fields>;
  stddev?: Maybe<Rocket_Command_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Command_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Command_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Command_Sum_Fields>;
  var_pop?: Maybe<Rocket_Command_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Command_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Command_Variance_Fields>;
};


/** aggregate fields of "rocket_command" */
export type Rocket_Command_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Command_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Command_Avg_Fields = {
  __typename?: 'rocket_command_avg_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_command". All fields are combined with a logical 'AND'. */
export type Rocket_Command_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Command_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Command_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Command_Bool_Exp>>;
  rocket_deploy_drogue_command?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
  rocket_deploy_main_command?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
  rocket_message?: InputMaybe<Rocket_Message_Bool_Exp>;
  rocket_message_id?: InputMaybe<Int_Comparison_Exp>;
  rocket_power_down_command?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
  rocket_radio_rate_change_command?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
};

/** unique or primary key constraints on table "rocket_command" */
export enum Rocket_Command_Constraint {
  /** unique or primary key constraint on columns "rocket_message_id" */
  RocketCommandPkey = 'rocket_command_pkey'
}

/** input type for incrementing numeric columns in table "rocket_command" */
export type Rocket_Command_Inc_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_command" */
export type Rocket_Command_Insert_Input = {
  rocket_deploy_drogue_command?: InputMaybe<Rocket_Deploy_Drogue_Command_Obj_Rel_Insert_Input>;
  rocket_deploy_main_command?: InputMaybe<Rocket_Deploy_Main_Command_Obj_Rel_Insert_Input>;
  rocket_message?: InputMaybe<Rocket_Message_Obj_Rel_Insert_Input>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  rocket_power_down_command?: InputMaybe<Rocket_Power_Down_Command_Obj_Rel_Insert_Input>;
  rocket_radio_rate_change_command?: InputMaybe<Rocket_Radio_Rate_Change_Command_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Rocket_Command_Max_Fields = {
  __typename?: 'rocket_command_max_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Command_Min_Fields = {
  __typename?: 'rocket_command_min_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_command" */
export type Rocket_Command_Mutation_Response = {
  __typename?: 'rocket_command_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Command>;
};

/** input type for inserting object relation for remote table "rocket_command" */
export type Rocket_Command_Obj_Rel_Insert_Input = {
  data: Rocket_Command_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Command_On_Conflict>;
};

/** on_conflict condition type for table "rocket_command" */
export type Rocket_Command_On_Conflict = {
  constraint: Rocket_Command_Constraint;
  update_columns?: Array<Rocket_Command_Update_Column>;
  where?: InputMaybe<Rocket_Command_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_command". */
export type Rocket_Command_Order_By = {
  rocket_deploy_drogue_command?: InputMaybe<Rocket_Deploy_Drogue_Command_Order_By>;
  rocket_deploy_main_command?: InputMaybe<Rocket_Deploy_Main_Command_Order_By>;
  rocket_message?: InputMaybe<Rocket_Message_Order_By>;
  rocket_message_id?: InputMaybe<Order_By>;
  rocket_power_down_command?: InputMaybe<Rocket_Power_Down_Command_Order_By>;
  rocket_radio_rate_change_command?: InputMaybe<Rocket_Radio_Rate_Change_Command_Order_By>;
};

/** primary key columns input for table: rocket_command */
export type Rocket_Command_Pk_Columns_Input = {
  rocket_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_command" */
export enum Rocket_Command_Select_Column {
  /** column name */
  RocketMessageId = 'rocket_message_id'
}

/** input type for updating data in table "rocket_command" */
export type Rocket_Command_Set_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Command_Stddev_Fields = {
  __typename?: 'rocket_command_stddev_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Command_Stddev_Pop_Fields = {
  __typename?: 'rocket_command_stddev_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Command_Stddev_Samp_Fields = {
  __typename?: 'rocket_command_stddev_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_command" */
export type Rocket_Command_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Command_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Command_Stream_Cursor_Value_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Command_Sum_Fields = {
  __typename?: 'rocket_command_sum_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_command" */
export enum Rocket_Command_Update_Column {
  /** column name */
  RocketMessageId = 'rocket_message_id'
}

export type Rocket_Command_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Command_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Command_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Command_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Command_Var_Pop_Fields = {
  __typename?: 'rocket_command_var_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Command_Var_Samp_Fields = {
  __typename?: 'rocket_command_var_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Command_Variance_Fields = {
  __typename?: 'rocket_command_variance_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command = {
  __typename?: 'rocket_deploy_drogue_command';
  /** An object relationship */
  rocket_command: Rocket_Command;
  rocket_command_id: Scalars['Int']['output'];
  val: Scalars['Boolean']['output'];
};

/** aggregated selection of "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Aggregate = {
  __typename?: 'rocket_deploy_drogue_command_aggregate';
  aggregate?: Maybe<Rocket_Deploy_Drogue_Command_Aggregate_Fields>;
  nodes: Array<Rocket_Deploy_Drogue_Command>;
};

/** aggregate fields of "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Aggregate_Fields = {
  __typename?: 'rocket_deploy_drogue_command_aggregate_fields';
  avg?: Maybe<Rocket_Deploy_Drogue_Command_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Deploy_Drogue_Command_Max_Fields>;
  min?: Maybe<Rocket_Deploy_Drogue_Command_Min_Fields>;
  stddev?: Maybe<Rocket_Deploy_Drogue_Command_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Deploy_Drogue_Command_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Deploy_Drogue_Command_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Deploy_Drogue_Command_Sum_Fields>;
  var_pop?: Maybe<Rocket_Deploy_Drogue_Command_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Deploy_Drogue_Command_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Deploy_Drogue_Command_Variance_Fields>;
};


/** aggregate fields of "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Deploy_Drogue_Command_Avg_Fields = {
  __typename?: 'rocket_deploy_drogue_command_avg_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_deploy_drogue_command". All fields are combined with a logical 'AND'. */
export type Rocket_Deploy_Drogue_Command_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Bool_Exp>>;
  rocket_command?: InputMaybe<Rocket_Command_Bool_Exp>;
  rocket_command_id?: InputMaybe<Int_Comparison_Exp>;
  val?: InputMaybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_deploy_drogue_command" */
export enum Rocket_Deploy_Drogue_Command_Constraint {
  /** unique or primary key constraint on columns "rocket_command_id" */
  RocketDeployDrogueCommandPkey = 'rocket_deploy_drogue_command_pkey'
}

/** input type for incrementing numeric columns in table "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Inc_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Insert_Input = {
  rocket_command?: InputMaybe<Rocket_Command_Obj_Rel_Insert_Input>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
  val?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate max on columns */
export type Rocket_Deploy_Drogue_Command_Max_Fields = {
  __typename?: 'rocket_deploy_drogue_command_max_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Deploy_Drogue_Command_Min_Fields = {
  __typename?: 'rocket_deploy_drogue_command_min_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Mutation_Response = {
  __typename?: 'rocket_deploy_drogue_command_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Deploy_Drogue_Command>;
};

/** input type for inserting object relation for remote table "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Obj_Rel_Insert_Input = {
  data: Rocket_Deploy_Drogue_Command_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Deploy_Drogue_Command_On_Conflict>;
};

/** on_conflict condition type for table "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_On_Conflict = {
  constraint: Rocket_Deploy_Drogue_Command_Constraint;
  update_columns?: Array<Rocket_Deploy_Drogue_Command_Update_Column>;
  where?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_deploy_drogue_command". */
export type Rocket_Deploy_Drogue_Command_Order_By = {
  rocket_command?: InputMaybe<Rocket_Command_Order_By>;
  rocket_command_id?: InputMaybe<Order_By>;
  val?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_deploy_drogue_command */
export type Rocket_Deploy_Drogue_Command_Pk_Columns_Input = {
  rocket_command_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_deploy_drogue_command" */
export enum Rocket_Deploy_Drogue_Command_Select_Column {
  /** column name */
  RocketCommandId = 'rocket_command_id',
  /** column name */
  Val = 'val'
}

/** input type for updating data in table "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Set_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
  val?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Deploy_Drogue_Command_Stddev_Fields = {
  __typename?: 'rocket_deploy_drogue_command_stddev_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Deploy_Drogue_Command_Stddev_Pop_Fields = {
  __typename?: 'rocket_deploy_drogue_command_stddev_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Deploy_Drogue_Command_Stddev_Samp_Fields = {
  __typename?: 'rocket_deploy_drogue_command_stddev_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_deploy_drogue_command" */
export type Rocket_Deploy_Drogue_Command_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Deploy_Drogue_Command_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Deploy_Drogue_Command_Stream_Cursor_Value_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
  val?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Deploy_Drogue_Command_Sum_Fields = {
  __typename?: 'rocket_deploy_drogue_command_sum_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_deploy_drogue_command" */
export enum Rocket_Deploy_Drogue_Command_Update_Column {
  /** column name */
  RocketCommandId = 'rocket_command_id',
  /** column name */
  Val = 'val'
}

export type Rocket_Deploy_Drogue_Command_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Deploy_Drogue_Command_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Deploy_Drogue_Command_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Deploy_Drogue_Command_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Deploy_Drogue_Command_Var_Pop_Fields = {
  __typename?: 'rocket_deploy_drogue_command_var_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Deploy_Drogue_Command_Var_Samp_Fields = {
  __typename?: 'rocket_deploy_drogue_command_var_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Deploy_Drogue_Command_Variance_Fields = {
  __typename?: 'rocket_deploy_drogue_command_variance_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command = {
  __typename?: 'rocket_deploy_main_command';
  /** An object relationship */
  rocket_command: Rocket_Command;
  rocket_command_id: Scalars['Int']['output'];
  val: Scalars['Boolean']['output'];
};

/** aggregated selection of "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Aggregate = {
  __typename?: 'rocket_deploy_main_command_aggregate';
  aggregate?: Maybe<Rocket_Deploy_Main_Command_Aggregate_Fields>;
  nodes: Array<Rocket_Deploy_Main_Command>;
};

/** aggregate fields of "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Aggregate_Fields = {
  __typename?: 'rocket_deploy_main_command_aggregate_fields';
  avg?: Maybe<Rocket_Deploy_Main_Command_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Deploy_Main_Command_Max_Fields>;
  min?: Maybe<Rocket_Deploy_Main_Command_Min_Fields>;
  stddev?: Maybe<Rocket_Deploy_Main_Command_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Deploy_Main_Command_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Deploy_Main_Command_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Deploy_Main_Command_Sum_Fields>;
  var_pop?: Maybe<Rocket_Deploy_Main_Command_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Deploy_Main_Command_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Deploy_Main_Command_Variance_Fields>;
};


/** aggregate fields of "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Deploy_Main_Command_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Deploy_Main_Command_Avg_Fields = {
  __typename?: 'rocket_deploy_main_command_avg_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_deploy_main_command". All fields are combined with a logical 'AND'. */
export type Rocket_Deploy_Main_Command_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Deploy_Main_Command_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Deploy_Main_Command_Bool_Exp>>;
  rocket_command?: InputMaybe<Rocket_Command_Bool_Exp>;
  rocket_command_id?: InputMaybe<Int_Comparison_Exp>;
  val?: InputMaybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_deploy_main_command" */
export enum Rocket_Deploy_Main_Command_Constraint {
  /** unique or primary key constraint on columns "rocket_command_id" */
  RocketDeployMainCommandPkey = 'rocket_deploy_main_command_pkey'
}

/** input type for incrementing numeric columns in table "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Inc_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Insert_Input = {
  rocket_command?: InputMaybe<Rocket_Command_Obj_Rel_Insert_Input>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
  val?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate max on columns */
export type Rocket_Deploy_Main_Command_Max_Fields = {
  __typename?: 'rocket_deploy_main_command_max_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Deploy_Main_Command_Min_Fields = {
  __typename?: 'rocket_deploy_main_command_min_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Mutation_Response = {
  __typename?: 'rocket_deploy_main_command_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Deploy_Main_Command>;
};

/** input type for inserting object relation for remote table "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Obj_Rel_Insert_Input = {
  data: Rocket_Deploy_Main_Command_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Deploy_Main_Command_On_Conflict>;
};

/** on_conflict condition type for table "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_On_Conflict = {
  constraint: Rocket_Deploy_Main_Command_Constraint;
  update_columns?: Array<Rocket_Deploy_Main_Command_Update_Column>;
  where?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_deploy_main_command". */
export type Rocket_Deploy_Main_Command_Order_By = {
  rocket_command?: InputMaybe<Rocket_Command_Order_By>;
  rocket_command_id?: InputMaybe<Order_By>;
  val?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_deploy_main_command */
export type Rocket_Deploy_Main_Command_Pk_Columns_Input = {
  rocket_command_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_deploy_main_command" */
export enum Rocket_Deploy_Main_Command_Select_Column {
  /** column name */
  RocketCommandId = 'rocket_command_id',
  /** column name */
  Val = 'val'
}

/** input type for updating data in table "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Set_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
  val?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Deploy_Main_Command_Stddev_Fields = {
  __typename?: 'rocket_deploy_main_command_stddev_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Deploy_Main_Command_Stddev_Pop_Fields = {
  __typename?: 'rocket_deploy_main_command_stddev_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Deploy_Main_Command_Stddev_Samp_Fields = {
  __typename?: 'rocket_deploy_main_command_stddev_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_deploy_main_command" */
export type Rocket_Deploy_Main_Command_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Deploy_Main_Command_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Deploy_Main_Command_Stream_Cursor_Value_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
  val?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Deploy_Main_Command_Sum_Fields = {
  __typename?: 'rocket_deploy_main_command_sum_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_deploy_main_command" */
export enum Rocket_Deploy_Main_Command_Update_Column {
  /** column name */
  RocketCommandId = 'rocket_command_id',
  /** column name */
  Val = 'val'
}

export type Rocket_Deploy_Main_Command_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Deploy_Main_Command_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Deploy_Main_Command_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Deploy_Main_Command_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Deploy_Main_Command_Var_Pop_Fields = {
  __typename?: 'rocket_deploy_main_command_var_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Deploy_Main_Command_Var_Samp_Fields = {
  __typename?: 'rocket_deploy_main_command_var_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Deploy_Main_Command_Variance_Fields = {
  __typename?: 'rocket_deploy_main_command_variance_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_health" */
export type Rocket_Health = {
  __typename?: 'rocket_health';
  /** An object relationship */
  rocket_health_status?: Maybe<Rocket_Health_Status>;
  /** An object relationship */
  rocket_message: Rocket_Message;
  rocket_message_id: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

/** aggregated selection of "rocket_health" */
export type Rocket_Health_Aggregate = {
  __typename?: 'rocket_health_aggregate';
  aggregate?: Maybe<Rocket_Health_Aggregate_Fields>;
  nodes: Array<Rocket_Health>;
};

/** aggregate fields of "rocket_health" */
export type Rocket_Health_Aggregate_Fields = {
  __typename?: 'rocket_health_aggregate_fields';
  avg?: Maybe<Rocket_Health_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Health_Max_Fields>;
  min?: Maybe<Rocket_Health_Min_Fields>;
  stddev?: Maybe<Rocket_Health_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Health_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Health_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Health_Sum_Fields>;
  var_pop?: Maybe<Rocket_Health_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Health_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Health_Variance_Fields>;
};


/** aggregate fields of "rocket_health" */
export type Rocket_Health_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Health_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Health_Avg_Fields = {
  __typename?: 'rocket_health_avg_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_health". All fields are combined with a logical 'AND'. */
export type Rocket_Health_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Health_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Health_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Health_Bool_Exp>>;
  rocket_health_status?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
  rocket_message?: InputMaybe<Rocket_Message_Bool_Exp>;
  rocket_message_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_health" */
export enum Rocket_Health_Constraint {
  /** unique or primary key constraint on columns "rocket_message_id" */
  RocketHealthPkey = 'rocket_health_pkey'
}

/** input type for incrementing numeric columns in table "rocket_health" */
export type Rocket_Health_Inc_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_health" */
export type Rocket_Health_Insert_Input = {
  rocket_health_status?: InputMaybe<Rocket_Health_Status_Obj_Rel_Insert_Input>;
  rocket_message?: InputMaybe<Rocket_Message_Obj_Rel_Insert_Input>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Rocket_Health_Max_Fields = {
  __typename?: 'rocket_health_max_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Rocket_Health_Min_Fields = {
  __typename?: 'rocket_health_min_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "rocket_health" */
export type Rocket_Health_Mutation_Response = {
  __typename?: 'rocket_health_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Health>;
};

/** input type for inserting object relation for remote table "rocket_health" */
export type Rocket_Health_Obj_Rel_Insert_Input = {
  data: Rocket_Health_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Health_On_Conflict>;
};

/** on_conflict condition type for table "rocket_health" */
export type Rocket_Health_On_Conflict = {
  constraint: Rocket_Health_Constraint;
  update_columns?: Array<Rocket_Health_Update_Column>;
  where?: InputMaybe<Rocket_Health_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_health". */
export type Rocket_Health_Order_By = {
  rocket_health_status?: InputMaybe<Rocket_Health_Status_Order_By>;
  rocket_message?: InputMaybe<Rocket_Message_Order_By>;
  rocket_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_health */
export type Rocket_Health_Pk_Columns_Input = {
  rocket_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_health" */
export enum Rocket_Health_Select_Column {
  /** column name */
  RocketMessageId = 'rocket_message_id',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "rocket_health" */
export type Rocket_Health_Set_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** columns and relationships of "rocket_health_status" */
export type Rocket_Health_Status = {
  __typename?: 'rocket_health_status';
  ext_3v3?: Maybe<Scalars['Int']['output']>;
  ext_v5?: Maybe<Scalars['Int']['output']>;
  failover_sense?: Maybe<Scalars['Int']['output']>;
  int_v3_3?: Maybe<Scalars['Int']['output']>;
  int_v5?: Maybe<Scalars['Int']['output']>;
  pyro_sense?: Maybe<Scalars['Int']['output']>;
  /** An object relationship */
  rocket_health: Rocket_Health;
  rocket_health_id: Scalars['Int']['output'];
  v3_3?: Maybe<Scalars['Int']['output']>;
  v5?: Maybe<Scalars['Int']['output']>;
  vcc_sense?: Maybe<Scalars['Int']['output']>;
};

/** aggregated selection of "rocket_health_status" */
export type Rocket_Health_Status_Aggregate = {
  __typename?: 'rocket_health_status_aggregate';
  aggregate?: Maybe<Rocket_Health_Status_Aggregate_Fields>;
  nodes: Array<Rocket_Health_Status>;
};

/** aggregate fields of "rocket_health_status" */
export type Rocket_Health_Status_Aggregate_Fields = {
  __typename?: 'rocket_health_status_aggregate_fields';
  avg?: Maybe<Rocket_Health_Status_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Health_Status_Max_Fields>;
  min?: Maybe<Rocket_Health_Status_Min_Fields>;
  stddev?: Maybe<Rocket_Health_Status_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Health_Status_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Health_Status_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Health_Status_Sum_Fields>;
  var_pop?: Maybe<Rocket_Health_Status_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Health_Status_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Health_Status_Variance_Fields>;
};


/** aggregate fields of "rocket_health_status" */
export type Rocket_Health_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Health_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Health_Status_Avg_Fields = {
  __typename?: 'rocket_health_status_avg_fields';
  ext_3v3?: Maybe<Scalars['Float']['output']>;
  ext_v5?: Maybe<Scalars['Float']['output']>;
  failover_sense?: Maybe<Scalars['Float']['output']>;
  int_v3_3?: Maybe<Scalars['Float']['output']>;
  int_v5?: Maybe<Scalars['Float']['output']>;
  pyro_sense?: Maybe<Scalars['Float']['output']>;
  rocket_health_id?: Maybe<Scalars['Float']['output']>;
  v3_3?: Maybe<Scalars['Float']['output']>;
  v5?: Maybe<Scalars['Float']['output']>;
  vcc_sense?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_health_status". All fields are combined with a logical 'AND'. */
export type Rocket_Health_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Health_Status_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Health_Status_Bool_Exp>>;
  ext_3v3?: InputMaybe<Int_Comparison_Exp>;
  ext_v5?: InputMaybe<Int_Comparison_Exp>;
  failover_sense?: InputMaybe<Int_Comparison_Exp>;
  int_v3_3?: InputMaybe<Int_Comparison_Exp>;
  int_v5?: InputMaybe<Int_Comparison_Exp>;
  pyro_sense?: InputMaybe<Int_Comparison_Exp>;
  rocket_health?: InputMaybe<Rocket_Health_Bool_Exp>;
  rocket_health_id?: InputMaybe<Int_Comparison_Exp>;
  v3_3?: InputMaybe<Int_Comparison_Exp>;
  v5?: InputMaybe<Int_Comparison_Exp>;
  vcc_sense?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_health_status" */
export enum Rocket_Health_Status_Constraint {
  /** unique or primary key constraint on columns "rocket_health_id" */
  RocketHealthStatusPkey = 'rocket_health_status_pkey'
}

/** input type for incrementing numeric columns in table "rocket_health_status" */
export type Rocket_Health_Status_Inc_Input = {
  ext_3v3?: InputMaybe<Scalars['Int']['input']>;
  ext_v5?: InputMaybe<Scalars['Int']['input']>;
  failover_sense?: InputMaybe<Scalars['Int']['input']>;
  int_v3_3?: InputMaybe<Scalars['Int']['input']>;
  int_v5?: InputMaybe<Scalars['Int']['input']>;
  pyro_sense?: InputMaybe<Scalars['Int']['input']>;
  rocket_health_id?: InputMaybe<Scalars['Int']['input']>;
  v3_3?: InputMaybe<Scalars['Int']['input']>;
  v5?: InputMaybe<Scalars['Int']['input']>;
  vcc_sense?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_health_status" */
export type Rocket_Health_Status_Insert_Input = {
  ext_3v3?: InputMaybe<Scalars['Int']['input']>;
  ext_v5?: InputMaybe<Scalars['Int']['input']>;
  failover_sense?: InputMaybe<Scalars['Int']['input']>;
  int_v3_3?: InputMaybe<Scalars['Int']['input']>;
  int_v5?: InputMaybe<Scalars['Int']['input']>;
  pyro_sense?: InputMaybe<Scalars['Int']['input']>;
  rocket_health?: InputMaybe<Rocket_Health_Obj_Rel_Insert_Input>;
  rocket_health_id?: InputMaybe<Scalars['Int']['input']>;
  v3_3?: InputMaybe<Scalars['Int']['input']>;
  v5?: InputMaybe<Scalars['Int']['input']>;
  vcc_sense?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Health_Status_Max_Fields = {
  __typename?: 'rocket_health_status_max_fields';
  ext_3v3?: Maybe<Scalars['Int']['output']>;
  ext_v5?: Maybe<Scalars['Int']['output']>;
  failover_sense?: Maybe<Scalars['Int']['output']>;
  int_v3_3?: Maybe<Scalars['Int']['output']>;
  int_v5?: Maybe<Scalars['Int']['output']>;
  pyro_sense?: Maybe<Scalars['Int']['output']>;
  rocket_health_id?: Maybe<Scalars['Int']['output']>;
  v3_3?: Maybe<Scalars['Int']['output']>;
  v5?: Maybe<Scalars['Int']['output']>;
  vcc_sense?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Health_Status_Min_Fields = {
  __typename?: 'rocket_health_status_min_fields';
  ext_3v3?: Maybe<Scalars['Int']['output']>;
  ext_v5?: Maybe<Scalars['Int']['output']>;
  failover_sense?: Maybe<Scalars['Int']['output']>;
  int_v3_3?: Maybe<Scalars['Int']['output']>;
  int_v5?: Maybe<Scalars['Int']['output']>;
  pyro_sense?: Maybe<Scalars['Int']['output']>;
  rocket_health_id?: Maybe<Scalars['Int']['output']>;
  v3_3?: Maybe<Scalars['Int']['output']>;
  v5?: Maybe<Scalars['Int']['output']>;
  vcc_sense?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_health_status" */
export type Rocket_Health_Status_Mutation_Response = {
  __typename?: 'rocket_health_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Health_Status>;
};

/** input type for inserting object relation for remote table "rocket_health_status" */
export type Rocket_Health_Status_Obj_Rel_Insert_Input = {
  data: Rocket_Health_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Health_Status_On_Conflict>;
};

/** on_conflict condition type for table "rocket_health_status" */
export type Rocket_Health_Status_On_Conflict = {
  constraint: Rocket_Health_Status_Constraint;
  update_columns?: Array<Rocket_Health_Status_Update_Column>;
  where?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_health_status". */
export type Rocket_Health_Status_Order_By = {
  ext_3v3?: InputMaybe<Order_By>;
  ext_v5?: InputMaybe<Order_By>;
  failover_sense?: InputMaybe<Order_By>;
  int_v3_3?: InputMaybe<Order_By>;
  int_v5?: InputMaybe<Order_By>;
  pyro_sense?: InputMaybe<Order_By>;
  rocket_health?: InputMaybe<Rocket_Health_Order_By>;
  rocket_health_id?: InputMaybe<Order_By>;
  v3_3?: InputMaybe<Order_By>;
  v5?: InputMaybe<Order_By>;
  vcc_sense?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_health_status */
export type Rocket_Health_Status_Pk_Columns_Input = {
  rocket_health_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_health_status" */
export enum Rocket_Health_Status_Select_Column {
  /** column name */
  Ext_3v3 = 'ext_3v3',
  /** column name */
  ExtV5 = 'ext_v5',
  /** column name */
  FailoverSense = 'failover_sense',
  /** column name */
  IntV3_3 = 'int_v3_3',
  /** column name */
  IntV5 = 'int_v5',
  /** column name */
  PyroSense = 'pyro_sense',
  /** column name */
  RocketHealthId = 'rocket_health_id',
  /** column name */
  V3_3 = 'v3_3',
  /** column name */
  V5 = 'v5',
  /** column name */
  VccSense = 'vcc_sense'
}

/** input type for updating data in table "rocket_health_status" */
export type Rocket_Health_Status_Set_Input = {
  ext_3v3?: InputMaybe<Scalars['Int']['input']>;
  ext_v5?: InputMaybe<Scalars['Int']['input']>;
  failover_sense?: InputMaybe<Scalars['Int']['input']>;
  int_v3_3?: InputMaybe<Scalars['Int']['input']>;
  int_v5?: InputMaybe<Scalars['Int']['input']>;
  pyro_sense?: InputMaybe<Scalars['Int']['input']>;
  rocket_health_id?: InputMaybe<Scalars['Int']['input']>;
  v3_3?: InputMaybe<Scalars['Int']['input']>;
  v5?: InputMaybe<Scalars['Int']['input']>;
  vcc_sense?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Health_Status_Stddev_Fields = {
  __typename?: 'rocket_health_status_stddev_fields';
  ext_3v3?: Maybe<Scalars['Float']['output']>;
  ext_v5?: Maybe<Scalars['Float']['output']>;
  failover_sense?: Maybe<Scalars['Float']['output']>;
  int_v3_3?: Maybe<Scalars['Float']['output']>;
  int_v5?: Maybe<Scalars['Float']['output']>;
  pyro_sense?: Maybe<Scalars['Float']['output']>;
  rocket_health_id?: Maybe<Scalars['Float']['output']>;
  v3_3?: Maybe<Scalars['Float']['output']>;
  v5?: Maybe<Scalars['Float']['output']>;
  vcc_sense?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Health_Status_Stddev_Pop_Fields = {
  __typename?: 'rocket_health_status_stddev_pop_fields';
  ext_3v3?: Maybe<Scalars['Float']['output']>;
  ext_v5?: Maybe<Scalars['Float']['output']>;
  failover_sense?: Maybe<Scalars['Float']['output']>;
  int_v3_3?: Maybe<Scalars['Float']['output']>;
  int_v5?: Maybe<Scalars['Float']['output']>;
  pyro_sense?: Maybe<Scalars['Float']['output']>;
  rocket_health_id?: Maybe<Scalars['Float']['output']>;
  v3_3?: Maybe<Scalars['Float']['output']>;
  v5?: Maybe<Scalars['Float']['output']>;
  vcc_sense?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Health_Status_Stddev_Samp_Fields = {
  __typename?: 'rocket_health_status_stddev_samp_fields';
  ext_3v3?: Maybe<Scalars['Float']['output']>;
  ext_v5?: Maybe<Scalars['Float']['output']>;
  failover_sense?: Maybe<Scalars['Float']['output']>;
  int_v3_3?: Maybe<Scalars['Float']['output']>;
  int_v5?: Maybe<Scalars['Float']['output']>;
  pyro_sense?: Maybe<Scalars['Float']['output']>;
  rocket_health_id?: Maybe<Scalars['Float']['output']>;
  v3_3?: Maybe<Scalars['Float']['output']>;
  v5?: Maybe<Scalars['Float']['output']>;
  vcc_sense?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_health_status" */
export type Rocket_Health_Status_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Health_Status_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Health_Status_Stream_Cursor_Value_Input = {
  ext_3v3?: InputMaybe<Scalars['Int']['input']>;
  ext_v5?: InputMaybe<Scalars['Int']['input']>;
  failover_sense?: InputMaybe<Scalars['Int']['input']>;
  int_v3_3?: InputMaybe<Scalars['Int']['input']>;
  int_v5?: InputMaybe<Scalars['Int']['input']>;
  pyro_sense?: InputMaybe<Scalars['Int']['input']>;
  rocket_health_id?: InputMaybe<Scalars['Int']['input']>;
  v3_3?: InputMaybe<Scalars['Int']['input']>;
  v5?: InputMaybe<Scalars['Int']['input']>;
  vcc_sense?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Health_Status_Sum_Fields = {
  __typename?: 'rocket_health_status_sum_fields';
  ext_3v3?: Maybe<Scalars['Int']['output']>;
  ext_v5?: Maybe<Scalars['Int']['output']>;
  failover_sense?: Maybe<Scalars['Int']['output']>;
  int_v3_3?: Maybe<Scalars['Int']['output']>;
  int_v5?: Maybe<Scalars['Int']['output']>;
  pyro_sense?: Maybe<Scalars['Int']['output']>;
  rocket_health_id?: Maybe<Scalars['Int']['output']>;
  v3_3?: Maybe<Scalars['Int']['output']>;
  v5?: Maybe<Scalars['Int']['output']>;
  vcc_sense?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_health_status" */
export enum Rocket_Health_Status_Update_Column {
  /** column name */
  Ext_3v3 = 'ext_3v3',
  /** column name */
  ExtV5 = 'ext_v5',
  /** column name */
  FailoverSense = 'failover_sense',
  /** column name */
  IntV3_3 = 'int_v3_3',
  /** column name */
  IntV5 = 'int_v5',
  /** column name */
  PyroSense = 'pyro_sense',
  /** column name */
  RocketHealthId = 'rocket_health_id',
  /** column name */
  V3_3 = 'v3_3',
  /** column name */
  V5 = 'v5',
  /** column name */
  VccSense = 'vcc_sense'
}

export type Rocket_Health_Status_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Health_Status_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Health_Status_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Health_Status_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Health_Status_Var_Pop_Fields = {
  __typename?: 'rocket_health_status_var_pop_fields';
  ext_3v3?: Maybe<Scalars['Float']['output']>;
  ext_v5?: Maybe<Scalars['Float']['output']>;
  failover_sense?: Maybe<Scalars['Float']['output']>;
  int_v3_3?: Maybe<Scalars['Float']['output']>;
  int_v5?: Maybe<Scalars['Float']['output']>;
  pyro_sense?: Maybe<Scalars['Float']['output']>;
  rocket_health_id?: Maybe<Scalars['Float']['output']>;
  v3_3?: Maybe<Scalars['Float']['output']>;
  v5?: Maybe<Scalars['Float']['output']>;
  vcc_sense?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Health_Status_Var_Samp_Fields = {
  __typename?: 'rocket_health_status_var_samp_fields';
  ext_3v3?: Maybe<Scalars['Float']['output']>;
  ext_v5?: Maybe<Scalars['Float']['output']>;
  failover_sense?: Maybe<Scalars['Float']['output']>;
  int_v3_3?: Maybe<Scalars['Float']['output']>;
  int_v5?: Maybe<Scalars['Float']['output']>;
  pyro_sense?: Maybe<Scalars['Float']['output']>;
  rocket_health_id?: Maybe<Scalars['Float']['output']>;
  v3_3?: Maybe<Scalars['Float']['output']>;
  v5?: Maybe<Scalars['Float']['output']>;
  vcc_sense?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Health_Status_Variance_Fields = {
  __typename?: 'rocket_health_status_variance_fields';
  ext_3v3?: Maybe<Scalars['Float']['output']>;
  ext_v5?: Maybe<Scalars['Float']['output']>;
  failover_sense?: Maybe<Scalars['Float']['output']>;
  int_v3_3?: Maybe<Scalars['Float']['output']>;
  int_v5?: Maybe<Scalars['Float']['output']>;
  pyro_sense?: Maybe<Scalars['Float']['output']>;
  rocket_health_id?: Maybe<Scalars['Float']['output']>;
  v3_3?: Maybe<Scalars['Float']['output']>;
  v5?: Maybe<Scalars['Float']['output']>;
  vcc_sense?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev on columns */
export type Rocket_Health_Stddev_Fields = {
  __typename?: 'rocket_health_stddev_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Health_Stddev_Pop_Fields = {
  __typename?: 'rocket_health_stddev_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Health_Stddev_Samp_Fields = {
  __typename?: 'rocket_health_stddev_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_health" */
export type Rocket_Health_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Health_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Health_Stream_Cursor_Value_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Health_Sum_Fields = {
  __typename?: 'rocket_health_sum_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_health" */
export enum Rocket_Health_Update_Column {
  /** column name */
  RocketMessageId = 'rocket_message_id',
  /** column name */
  Status = 'status'
}

export type Rocket_Health_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Health_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Health_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Health_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Health_Var_Pop_Fields = {
  __typename?: 'rocket_health_var_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Health_Var_Samp_Fields = {
  __typename?: 'rocket_health_var_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Health_Variance_Fields = {
  __typename?: 'rocket_health_variance_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_heartbeat" */
export type Rocket_Heartbeat = {
  __typename?: 'rocket_heartbeat';
  autopilot: Scalars['Int']['output'];
  base_mode: Scalars['Int']['output'];
  created_at: Scalars['timestamp']['output'];
  custom_mode: Scalars['Int']['output'];
  mavlink_version: Scalars['Int']['output'];
  mavtype: Scalars['Int']['output'];
  system_status: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_heartbeat" */
export type Rocket_Heartbeat_Aggregate = {
  __typename?: 'rocket_heartbeat_aggregate';
  aggregate?: Maybe<Rocket_Heartbeat_Aggregate_Fields>;
  nodes: Array<Rocket_Heartbeat>;
};

/** aggregate fields of "rocket_heartbeat" */
export type Rocket_Heartbeat_Aggregate_Fields = {
  __typename?: 'rocket_heartbeat_aggregate_fields';
  avg?: Maybe<Rocket_Heartbeat_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Heartbeat_Max_Fields>;
  min?: Maybe<Rocket_Heartbeat_Min_Fields>;
  stddev?: Maybe<Rocket_Heartbeat_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Heartbeat_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Heartbeat_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Heartbeat_Sum_Fields>;
  var_pop?: Maybe<Rocket_Heartbeat_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Heartbeat_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Heartbeat_Variance_Fields>;
};


/** aggregate fields of "rocket_heartbeat" */
export type Rocket_Heartbeat_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Heartbeat_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Heartbeat_Avg_Fields = {
  __typename?: 'rocket_heartbeat_avg_fields';
  autopilot?: Maybe<Scalars['Float']['output']>;
  base_mode?: Maybe<Scalars['Float']['output']>;
  custom_mode?: Maybe<Scalars['Float']['output']>;
  mavlink_version?: Maybe<Scalars['Float']['output']>;
  mavtype?: Maybe<Scalars['Float']['output']>;
  system_status?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_heartbeat". All fields are combined with a logical 'AND'. */
export type Rocket_Heartbeat_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Heartbeat_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Heartbeat_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Heartbeat_Bool_Exp>>;
  autopilot?: InputMaybe<Int_Comparison_Exp>;
  base_mode?: InputMaybe<Int_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  custom_mode?: InputMaybe<Int_Comparison_Exp>;
  mavlink_version?: InputMaybe<Int_Comparison_Exp>;
  mavtype?: InputMaybe<Int_Comparison_Exp>;
  system_status?: InputMaybe<Int_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "rocket_heartbeat" */
export type Rocket_Heartbeat_Inc_Input = {
  autopilot?: InputMaybe<Scalars['Int']['input']>;
  base_mode?: InputMaybe<Scalars['Int']['input']>;
  custom_mode?: InputMaybe<Scalars['Int']['input']>;
  mavlink_version?: InputMaybe<Scalars['Int']['input']>;
  mavtype?: InputMaybe<Scalars['Int']['input']>;
  system_status?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_heartbeat" */
export type Rocket_Heartbeat_Insert_Input = {
  autopilot?: InputMaybe<Scalars['Int']['input']>;
  base_mode?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  custom_mode?: InputMaybe<Scalars['Int']['input']>;
  mavlink_version?: InputMaybe<Scalars['Int']['input']>;
  mavtype?: InputMaybe<Scalars['Int']['input']>;
  system_status?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Heartbeat_Max_Fields = {
  __typename?: 'rocket_heartbeat_max_fields';
  autopilot?: Maybe<Scalars['Int']['output']>;
  base_mode?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  custom_mode?: Maybe<Scalars['Int']['output']>;
  mavlink_version?: Maybe<Scalars['Int']['output']>;
  mavtype?: Maybe<Scalars['Int']['output']>;
  system_status?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Heartbeat_Min_Fields = {
  __typename?: 'rocket_heartbeat_min_fields';
  autopilot?: Maybe<Scalars['Int']['output']>;
  base_mode?: Maybe<Scalars['Int']['output']>;
  created_at?: Maybe<Scalars['timestamp']['output']>;
  custom_mode?: Maybe<Scalars['Int']['output']>;
  mavlink_version?: Maybe<Scalars['Int']['output']>;
  mavtype?: Maybe<Scalars['Int']['output']>;
  system_status?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_heartbeat" */
export type Rocket_Heartbeat_Mutation_Response = {
  __typename?: 'rocket_heartbeat_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Heartbeat>;
};

/** Ordering options when selecting data from "rocket_heartbeat". */
export type Rocket_Heartbeat_Order_By = {
  autopilot?: InputMaybe<Order_By>;
  base_mode?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  custom_mode?: InputMaybe<Order_By>;
  mavlink_version?: InputMaybe<Order_By>;
  mavtype?: InputMaybe<Order_By>;
  system_status?: InputMaybe<Order_By>;
};

/** select columns of table "rocket_heartbeat" */
export enum Rocket_Heartbeat_Select_Column {
  /** column name */
  Autopilot = 'autopilot',
  /** column name */
  BaseMode = 'base_mode',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CustomMode = 'custom_mode',
  /** column name */
  MavlinkVersion = 'mavlink_version',
  /** column name */
  Mavtype = 'mavtype',
  /** column name */
  SystemStatus = 'system_status'
}

/** input type for updating data in table "rocket_heartbeat" */
export type Rocket_Heartbeat_Set_Input = {
  autopilot?: InputMaybe<Scalars['Int']['input']>;
  base_mode?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  custom_mode?: InputMaybe<Scalars['Int']['input']>;
  mavlink_version?: InputMaybe<Scalars['Int']['input']>;
  mavtype?: InputMaybe<Scalars['Int']['input']>;
  system_status?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Heartbeat_Stddev_Fields = {
  __typename?: 'rocket_heartbeat_stddev_fields';
  autopilot?: Maybe<Scalars['Float']['output']>;
  base_mode?: Maybe<Scalars['Float']['output']>;
  custom_mode?: Maybe<Scalars['Float']['output']>;
  mavlink_version?: Maybe<Scalars['Float']['output']>;
  mavtype?: Maybe<Scalars['Float']['output']>;
  system_status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Heartbeat_Stddev_Pop_Fields = {
  __typename?: 'rocket_heartbeat_stddev_pop_fields';
  autopilot?: Maybe<Scalars['Float']['output']>;
  base_mode?: Maybe<Scalars['Float']['output']>;
  custom_mode?: Maybe<Scalars['Float']['output']>;
  mavlink_version?: Maybe<Scalars['Float']['output']>;
  mavtype?: Maybe<Scalars['Float']['output']>;
  system_status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Heartbeat_Stddev_Samp_Fields = {
  __typename?: 'rocket_heartbeat_stddev_samp_fields';
  autopilot?: Maybe<Scalars['Float']['output']>;
  base_mode?: Maybe<Scalars['Float']['output']>;
  custom_mode?: Maybe<Scalars['Float']['output']>;
  mavlink_version?: Maybe<Scalars['Float']['output']>;
  mavtype?: Maybe<Scalars['Float']['output']>;
  system_status?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_heartbeat" */
export type Rocket_Heartbeat_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Heartbeat_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Heartbeat_Stream_Cursor_Value_Input = {
  autopilot?: InputMaybe<Scalars['Int']['input']>;
  base_mode?: InputMaybe<Scalars['Int']['input']>;
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  custom_mode?: InputMaybe<Scalars['Int']['input']>;
  mavlink_version?: InputMaybe<Scalars['Int']['input']>;
  mavtype?: InputMaybe<Scalars['Int']['input']>;
  system_status?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Heartbeat_Sum_Fields = {
  __typename?: 'rocket_heartbeat_sum_fields';
  autopilot?: Maybe<Scalars['Int']['output']>;
  base_mode?: Maybe<Scalars['Int']['output']>;
  custom_mode?: Maybe<Scalars['Int']['output']>;
  mavlink_version?: Maybe<Scalars['Int']['output']>;
  mavtype?: Maybe<Scalars['Int']['output']>;
  system_status?: Maybe<Scalars['Int']['output']>;
};

export type Rocket_Heartbeat_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Heartbeat_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Heartbeat_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Heartbeat_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Heartbeat_Var_Pop_Fields = {
  __typename?: 'rocket_heartbeat_var_pop_fields';
  autopilot?: Maybe<Scalars['Float']['output']>;
  base_mode?: Maybe<Scalars['Float']['output']>;
  custom_mode?: Maybe<Scalars['Float']['output']>;
  mavlink_version?: Maybe<Scalars['Float']['output']>;
  mavtype?: Maybe<Scalars['Float']['output']>;
  system_status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Heartbeat_Var_Samp_Fields = {
  __typename?: 'rocket_heartbeat_var_samp_fields';
  autopilot?: Maybe<Scalars['Float']['output']>;
  base_mode?: Maybe<Scalars['Float']['output']>;
  custom_mode?: Maybe<Scalars['Float']['output']>;
  mavlink_version?: Maybe<Scalars['Float']['output']>;
  mavtype?: Maybe<Scalars['Float']['output']>;
  system_status?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Heartbeat_Variance_Fields = {
  __typename?: 'rocket_heartbeat_variance_fields';
  autopilot?: Maybe<Scalars['Float']['output']>;
  base_mode?: Maybe<Scalars['Float']['output']>;
  custom_mode?: Maybe<Scalars['Float']['output']>;
  mavlink_version?: Maybe<Scalars['Float']['output']>;
  mavtype?: Maybe<Scalars['Float']['output']>;
  system_status?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_log" */
export type Rocket_Log = {
  __typename?: 'rocket_log';
  event: Scalars['String']['output'];
  level: Scalars['String']['output'];
  /** An object relationship */
  rocket_message: Rocket_Message;
  rocket_message_id: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_log" */
export type Rocket_Log_Aggregate = {
  __typename?: 'rocket_log_aggregate';
  aggregate?: Maybe<Rocket_Log_Aggregate_Fields>;
  nodes: Array<Rocket_Log>;
};

/** aggregate fields of "rocket_log" */
export type Rocket_Log_Aggregate_Fields = {
  __typename?: 'rocket_log_aggregate_fields';
  avg?: Maybe<Rocket_Log_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Log_Max_Fields>;
  min?: Maybe<Rocket_Log_Min_Fields>;
  stddev?: Maybe<Rocket_Log_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Log_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Log_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Log_Sum_Fields>;
  var_pop?: Maybe<Rocket_Log_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Log_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Log_Variance_Fields>;
};


/** aggregate fields of "rocket_log" */
export type Rocket_Log_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Log_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Log_Avg_Fields = {
  __typename?: 'rocket_log_avg_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_log". All fields are combined with a logical 'AND'. */
export type Rocket_Log_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Log_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Log_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Log_Bool_Exp>>;
  event?: InputMaybe<String_Comparison_Exp>;
  level?: InputMaybe<String_Comparison_Exp>;
  rocket_message?: InputMaybe<Rocket_Message_Bool_Exp>;
  rocket_message_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_log" */
export enum Rocket_Log_Constraint {
  /** unique or primary key constraint on columns "rocket_message_id" */
  RocketLogPkey = 'rocket_log_pkey'
}

/** input type for incrementing numeric columns in table "rocket_log" */
export type Rocket_Log_Inc_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_log" */
export type Rocket_Log_Insert_Input = {
  event?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['String']['input']>;
  rocket_message?: InputMaybe<Rocket_Message_Obj_Rel_Insert_Input>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Log_Max_Fields = {
  __typename?: 'rocket_log_max_fields';
  event?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Log_Min_Fields = {
  __typename?: 'rocket_log_min_fields';
  event?: Maybe<Scalars['String']['output']>;
  level?: Maybe<Scalars['String']['output']>;
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_log" */
export type Rocket_Log_Mutation_Response = {
  __typename?: 'rocket_log_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Log>;
};

/** input type for inserting object relation for remote table "rocket_log" */
export type Rocket_Log_Obj_Rel_Insert_Input = {
  data: Rocket_Log_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Log_On_Conflict>;
};

/** on_conflict condition type for table "rocket_log" */
export type Rocket_Log_On_Conflict = {
  constraint: Rocket_Log_Constraint;
  update_columns?: Array<Rocket_Log_Update_Column>;
  where?: InputMaybe<Rocket_Log_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_log". */
export type Rocket_Log_Order_By = {
  event?: InputMaybe<Order_By>;
  level?: InputMaybe<Order_By>;
  rocket_message?: InputMaybe<Rocket_Message_Order_By>;
  rocket_message_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_log */
export type Rocket_Log_Pk_Columns_Input = {
  rocket_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_log" */
export enum Rocket_Log_Select_Column {
  /** column name */
  Event = 'event',
  /** column name */
  Level = 'level',
  /** column name */
  RocketMessageId = 'rocket_message_id'
}

/** input type for updating data in table "rocket_log" */
export type Rocket_Log_Set_Input = {
  event?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['String']['input']>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Log_Stddev_Fields = {
  __typename?: 'rocket_log_stddev_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Log_Stddev_Pop_Fields = {
  __typename?: 'rocket_log_stddev_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Log_Stddev_Samp_Fields = {
  __typename?: 'rocket_log_stddev_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_log" */
export type Rocket_Log_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Log_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Log_Stream_Cursor_Value_Input = {
  event?: InputMaybe<Scalars['String']['input']>;
  level?: InputMaybe<Scalars['String']['input']>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Log_Sum_Fields = {
  __typename?: 'rocket_log_sum_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_log" */
export enum Rocket_Log_Update_Column {
  /** column name */
  Event = 'event',
  /** column name */
  Level = 'level',
  /** column name */
  RocketMessageId = 'rocket_message_id'
}

export type Rocket_Log_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Log_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Log_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Log_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Log_Var_Pop_Fields = {
  __typename?: 'rocket_log_var_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Log_Var_Samp_Fields = {
  __typename?: 'rocket_log_var_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Log_Variance_Fields = {
  __typename?: 'rocket_log_variance_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_message" */
export type Rocket_Message = {
  __typename?: 'rocket_message';
  created_at: Scalars['timestamp']['output'];
  id: Scalars['Int']['output'];
  message_type: Scalars['String']['output'];
  /** An object relationship */
  rocket_command?: Maybe<Rocket_Command>;
  /** An object relationship */
  rocket_health?: Maybe<Rocket_Health>;
  /** An object relationship */
  rocket_log?: Maybe<Rocket_Log>;
  /** An object relationship */
  rocket_sensor_message?: Maybe<Rocket_Sensor_Message>;
  /** An object relationship */
  rocket_state?: Maybe<Rocket_State>;
  sender: Scalars['String']['output'];
  time_stamp: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_message" */
export type Rocket_Message_Aggregate = {
  __typename?: 'rocket_message_aggregate';
  aggregate?: Maybe<Rocket_Message_Aggregate_Fields>;
  nodes: Array<Rocket_Message>;
};

/** aggregate fields of "rocket_message" */
export type Rocket_Message_Aggregate_Fields = {
  __typename?: 'rocket_message_aggregate_fields';
  avg?: Maybe<Rocket_Message_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Message_Max_Fields>;
  min?: Maybe<Rocket_Message_Min_Fields>;
  stddev?: Maybe<Rocket_Message_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Message_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Message_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Message_Sum_Fields>;
  var_pop?: Maybe<Rocket_Message_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Message_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Message_Variance_Fields>;
};


/** aggregate fields of "rocket_message" */
export type Rocket_Message_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Message_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Message_Avg_Fields = {
  __typename?: 'rocket_message_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_message". All fields are combined with a logical 'AND'. */
export type Rocket_Message_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Message_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Message_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Message_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  message_type?: InputMaybe<String_Comparison_Exp>;
  rocket_command?: InputMaybe<Rocket_Command_Bool_Exp>;
  rocket_health?: InputMaybe<Rocket_Health_Bool_Exp>;
  rocket_log?: InputMaybe<Rocket_Log_Bool_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_state?: InputMaybe<Rocket_State_Bool_Exp>;
  sender?: InputMaybe<String_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_message" */
export enum Rocket_Message_Constraint {
  /** unique or primary key constraint on columns "id" */
  RocketMessagePkey = 'rocket_message_pkey'
}

/** input type for incrementing numeric columns in table "rocket_message" */
export type Rocket_Message_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_message" */
export type Rocket_Message_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  message_type?: InputMaybe<Scalars['String']['input']>;
  rocket_command?: InputMaybe<Rocket_Command_Obj_Rel_Insert_Input>;
  rocket_health?: InputMaybe<Rocket_Health_Obj_Rel_Insert_Input>;
  rocket_log?: InputMaybe<Rocket_Log_Obj_Rel_Insert_Input>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_state?: InputMaybe<Rocket_State_Obj_Rel_Insert_Input>;
  sender?: InputMaybe<Scalars['String']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Message_Max_Fields = {
  __typename?: 'rocket_message_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  message_type?: Maybe<Scalars['String']['output']>;
  sender?: Maybe<Scalars['String']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Message_Min_Fields = {
  __typename?: 'rocket_message_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  message_type?: Maybe<Scalars['String']['output']>;
  sender?: Maybe<Scalars['String']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_message" */
export type Rocket_Message_Mutation_Response = {
  __typename?: 'rocket_message_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Message>;
};

/** input type for inserting object relation for remote table "rocket_message" */
export type Rocket_Message_Obj_Rel_Insert_Input = {
  data: Rocket_Message_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Message_On_Conflict>;
};

/** on_conflict condition type for table "rocket_message" */
export type Rocket_Message_On_Conflict = {
  constraint: Rocket_Message_Constraint;
  update_columns?: Array<Rocket_Message_Update_Column>;
  where?: InputMaybe<Rocket_Message_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_message". */
export type Rocket_Message_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  message_type?: InputMaybe<Order_By>;
  rocket_command?: InputMaybe<Rocket_Command_Order_By>;
  rocket_health?: InputMaybe<Rocket_Health_Order_By>;
  rocket_log?: InputMaybe<Rocket_Log_Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_state?: InputMaybe<Rocket_State_Order_By>;
  sender?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_message */
export type Rocket_Message_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "rocket_message" */
export enum Rocket_Message_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MessageType = 'message_type',
  /** column name */
  Sender = 'sender',
  /** column name */
  TimeStamp = 'time_stamp'
}

/** input type for updating data in table "rocket_message" */
export type Rocket_Message_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  message_type?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Message_Stddev_Fields = {
  __typename?: 'rocket_message_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Message_Stddev_Pop_Fields = {
  __typename?: 'rocket_message_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Message_Stddev_Samp_Fields = {
  __typename?: 'rocket_message_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_message" */
export type Rocket_Message_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Message_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Message_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  message_type?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['String']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Message_Sum_Fields = {
  __typename?: 'rocket_message_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_message" */
export enum Rocket_Message_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MessageType = 'message_type',
  /** column name */
  Sender = 'sender',
  /** column name */
  TimeStamp = 'time_stamp'
}

export type Rocket_Message_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Message_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Message_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Message_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Message_Var_Pop_Fields = {
  __typename?: 'rocket_message_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Message_Var_Samp_Fields = {
  __typename?: 'rocket_message_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Message_Variance_Fields = {
  __typename?: 'rocket_message_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_power_down_command" */
export type Rocket_Power_Down_Command = {
  __typename?: 'rocket_power_down_command';
  board: Scalars['String']['output'];
  /** An object relationship */
  rocket_command: Rocket_Command;
  rocket_command_id: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Aggregate = {
  __typename?: 'rocket_power_down_command_aggregate';
  aggregate?: Maybe<Rocket_Power_Down_Command_Aggregate_Fields>;
  nodes: Array<Rocket_Power_Down_Command>;
};

/** aggregate fields of "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Aggregate_Fields = {
  __typename?: 'rocket_power_down_command_aggregate_fields';
  avg?: Maybe<Rocket_Power_Down_Command_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Power_Down_Command_Max_Fields>;
  min?: Maybe<Rocket_Power_Down_Command_Min_Fields>;
  stddev?: Maybe<Rocket_Power_Down_Command_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Power_Down_Command_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Power_Down_Command_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Power_Down_Command_Sum_Fields>;
  var_pop?: Maybe<Rocket_Power_Down_Command_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Power_Down_Command_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Power_Down_Command_Variance_Fields>;
};


/** aggregate fields of "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Power_Down_Command_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Power_Down_Command_Avg_Fields = {
  __typename?: 'rocket_power_down_command_avg_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_power_down_command". All fields are combined with a logical 'AND'. */
export type Rocket_Power_Down_Command_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Power_Down_Command_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Power_Down_Command_Bool_Exp>>;
  board?: InputMaybe<String_Comparison_Exp>;
  rocket_command?: InputMaybe<Rocket_Command_Bool_Exp>;
  rocket_command_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_power_down_command" */
export enum Rocket_Power_Down_Command_Constraint {
  /** unique or primary key constraint on columns "rocket_command_id" */
  RocketPowerDownCommandPkey = 'rocket_power_down_command_pkey'
}

/** input type for incrementing numeric columns in table "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Inc_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Insert_Input = {
  board?: InputMaybe<Scalars['String']['input']>;
  rocket_command?: InputMaybe<Rocket_Command_Obj_Rel_Insert_Input>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Power_Down_Command_Max_Fields = {
  __typename?: 'rocket_power_down_command_max_fields';
  board?: Maybe<Scalars['String']['output']>;
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Power_Down_Command_Min_Fields = {
  __typename?: 'rocket_power_down_command_min_fields';
  board?: Maybe<Scalars['String']['output']>;
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Mutation_Response = {
  __typename?: 'rocket_power_down_command_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Power_Down_Command>;
};

/** input type for inserting object relation for remote table "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Obj_Rel_Insert_Input = {
  data: Rocket_Power_Down_Command_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Power_Down_Command_On_Conflict>;
};

/** on_conflict condition type for table "rocket_power_down_command" */
export type Rocket_Power_Down_Command_On_Conflict = {
  constraint: Rocket_Power_Down_Command_Constraint;
  update_columns?: Array<Rocket_Power_Down_Command_Update_Column>;
  where?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_power_down_command". */
export type Rocket_Power_Down_Command_Order_By = {
  board?: InputMaybe<Order_By>;
  rocket_command?: InputMaybe<Rocket_Command_Order_By>;
  rocket_command_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_power_down_command */
export type Rocket_Power_Down_Command_Pk_Columns_Input = {
  rocket_command_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_power_down_command" */
export enum Rocket_Power_Down_Command_Select_Column {
  /** column name */
  Board = 'board',
  /** column name */
  RocketCommandId = 'rocket_command_id'
}

/** input type for updating data in table "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Set_Input = {
  board?: InputMaybe<Scalars['String']['input']>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Power_Down_Command_Stddev_Fields = {
  __typename?: 'rocket_power_down_command_stddev_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Power_Down_Command_Stddev_Pop_Fields = {
  __typename?: 'rocket_power_down_command_stddev_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Power_Down_Command_Stddev_Samp_Fields = {
  __typename?: 'rocket_power_down_command_stddev_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_power_down_command" */
export type Rocket_Power_Down_Command_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Power_Down_Command_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Power_Down_Command_Stream_Cursor_Value_Input = {
  board?: InputMaybe<Scalars['String']['input']>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Power_Down_Command_Sum_Fields = {
  __typename?: 'rocket_power_down_command_sum_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_power_down_command" */
export enum Rocket_Power_Down_Command_Update_Column {
  /** column name */
  Board = 'board',
  /** column name */
  RocketCommandId = 'rocket_command_id'
}

export type Rocket_Power_Down_Command_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Power_Down_Command_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Power_Down_Command_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Power_Down_Command_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Power_Down_Command_Var_Pop_Fields = {
  __typename?: 'rocket_power_down_command_var_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Power_Down_Command_Var_Samp_Fields = {
  __typename?: 'rocket_power_down_command_var_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Power_Down_Command_Variance_Fields = {
  __typename?: 'rocket_power_down_command_variance_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command = {
  __typename?: 'rocket_radio_rate_change_command';
  rate: Scalars['String']['output'];
  /** An object relationship */
  rocket_command: Rocket_Command;
  rocket_command_id: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Aggregate = {
  __typename?: 'rocket_radio_rate_change_command_aggregate';
  aggregate?: Maybe<Rocket_Radio_Rate_Change_Command_Aggregate_Fields>;
  nodes: Array<Rocket_Radio_Rate_Change_Command>;
};

/** aggregate fields of "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Aggregate_Fields = {
  __typename?: 'rocket_radio_rate_change_command_aggregate_fields';
  avg?: Maybe<Rocket_Radio_Rate_Change_Command_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Radio_Rate_Change_Command_Max_Fields>;
  min?: Maybe<Rocket_Radio_Rate_Change_Command_Min_Fields>;
  stddev?: Maybe<Rocket_Radio_Rate_Change_Command_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Radio_Rate_Change_Command_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Radio_Rate_Change_Command_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Radio_Rate_Change_Command_Sum_Fields>;
  var_pop?: Maybe<Rocket_Radio_Rate_Change_Command_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Radio_Rate_Change_Command_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Radio_Rate_Change_Command_Variance_Fields>;
};


/** aggregate fields of "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Radio_Rate_Change_Command_Avg_Fields = {
  __typename?: 'rocket_radio_rate_change_command_avg_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_radio_rate_change_command". All fields are combined with a logical 'AND'. */
export type Rocket_Radio_Rate_Change_Command_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Bool_Exp>>;
  rate?: InputMaybe<String_Comparison_Exp>;
  rocket_command?: InputMaybe<Rocket_Command_Bool_Exp>;
  rocket_command_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_radio_rate_change_command" */
export enum Rocket_Radio_Rate_Change_Command_Constraint {
  /** unique or primary key constraint on columns "rocket_command_id" */
  RocketRadioRateChangeCommandPkey = 'rocket_radio_rate_change_command_pkey'
}

/** input type for incrementing numeric columns in table "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Inc_Input = {
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Insert_Input = {
  rate?: InputMaybe<Scalars['String']['input']>;
  rocket_command?: InputMaybe<Rocket_Command_Obj_Rel_Insert_Input>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Radio_Rate_Change_Command_Max_Fields = {
  __typename?: 'rocket_radio_rate_change_command_max_fields';
  rate?: Maybe<Scalars['String']['output']>;
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Radio_Rate_Change_Command_Min_Fields = {
  __typename?: 'rocket_radio_rate_change_command_min_fields';
  rate?: Maybe<Scalars['String']['output']>;
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Mutation_Response = {
  __typename?: 'rocket_radio_rate_change_command_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Radio_Rate_Change_Command>;
};

/** input type for inserting object relation for remote table "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Obj_Rel_Insert_Input = {
  data: Rocket_Radio_Rate_Change_Command_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Radio_Rate_Change_Command_On_Conflict>;
};

/** on_conflict condition type for table "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_On_Conflict = {
  constraint: Rocket_Radio_Rate_Change_Command_Constraint;
  update_columns?: Array<Rocket_Radio_Rate_Change_Command_Update_Column>;
  where?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_radio_rate_change_command". */
export type Rocket_Radio_Rate_Change_Command_Order_By = {
  rate?: InputMaybe<Order_By>;
  rocket_command?: InputMaybe<Rocket_Command_Order_By>;
  rocket_command_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_radio_rate_change_command */
export type Rocket_Radio_Rate_Change_Command_Pk_Columns_Input = {
  rocket_command_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_radio_rate_change_command" */
export enum Rocket_Radio_Rate_Change_Command_Select_Column {
  /** column name */
  Rate = 'rate',
  /** column name */
  RocketCommandId = 'rocket_command_id'
}

/** input type for updating data in table "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Set_Input = {
  rate?: InputMaybe<Scalars['String']['input']>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Radio_Rate_Change_Command_Stddev_Fields = {
  __typename?: 'rocket_radio_rate_change_command_stddev_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Radio_Rate_Change_Command_Stddev_Pop_Fields = {
  __typename?: 'rocket_radio_rate_change_command_stddev_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Radio_Rate_Change_Command_Stddev_Samp_Fields = {
  __typename?: 'rocket_radio_rate_change_command_stddev_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_radio_rate_change_command" */
export type Rocket_Radio_Rate_Change_Command_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Radio_Rate_Change_Command_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Radio_Rate_Change_Command_Stream_Cursor_Value_Input = {
  rate?: InputMaybe<Scalars['String']['input']>;
  rocket_command_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Radio_Rate_Change_Command_Sum_Fields = {
  __typename?: 'rocket_radio_rate_change_command_sum_fields';
  rocket_command_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_radio_rate_change_command" */
export enum Rocket_Radio_Rate_Change_Command_Update_Column {
  /** column name */
  Rate = 'rate',
  /** column name */
  RocketCommandId = 'rocket_command_id'
}

export type Rocket_Radio_Rate_Change_Command_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Radio_Rate_Change_Command_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Radio_Rate_Change_Command_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Radio_Rate_Change_Command_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Radio_Rate_Change_Command_Var_Pop_Fields = {
  __typename?: 'rocket_radio_rate_change_command_var_pop_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Radio_Rate_Change_Command_Var_Samp_Fields = {
  __typename?: 'rocket_radio_rate_change_command_var_samp_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Radio_Rate_Change_Command_Variance_Fields = {
  __typename?: 'rocket_radio_rate_change_command_variance_fields';
  rocket_command_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_radio_status" */
export type Rocket_Radio_Status = {
  __typename?: 'rocket_radio_status';
  created_at: Scalars['timestamp']['output'];
  fixed: Scalars['Int']['output'];
  noise: Scalars['Int']['output'];
  remnoise: Scalars['Int']['output'];
  remrssi: Scalars['Int']['output'];
  rssi: Scalars['Int']['output'];
  rxerrors: Scalars['Int']['output'];
  txbuf: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_radio_status" */
export type Rocket_Radio_Status_Aggregate = {
  __typename?: 'rocket_radio_status_aggregate';
  aggregate?: Maybe<Rocket_Radio_Status_Aggregate_Fields>;
  nodes: Array<Rocket_Radio_Status>;
};

/** aggregate fields of "rocket_radio_status" */
export type Rocket_Radio_Status_Aggregate_Fields = {
  __typename?: 'rocket_radio_status_aggregate_fields';
  avg?: Maybe<Rocket_Radio_Status_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Radio_Status_Max_Fields>;
  min?: Maybe<Rocket_Radio_Status_Min_Fields>;
  stddev?: Maybe<Rocket_Radio_Status_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Radio_Status_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Radio_Status_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Radio_Status_Sum_Fields>;
  var_pop?: Maybe<Rocket_Radio_Status_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Radio_Status_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Radio_Status_Variance_Fields>;
};


/** aggregate fields of "rocket_radio_status" */
export type Rocket_Radio_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Radio_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Radio_Status_Avg_Fields = {
  __typename?: 'rocket_radio_status_avg_fields';
  fixed?: Maybe<Scalars['Float']['output']>;
  noise?: Maybe<Scalars['Float']['output']>;
  remnoise?: Maybe<Scalars['Float']['output']>;
  remrssi?: Maybe<Scalars['Float']['output']>;
  rssi?: Maybe<Scalars['Float']['output']>;
  rxerrors?: Maybe<Scalars['Float']['output']>;
  txbuf?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_radio_status". All fields are combined with a logical 'AND'. */
export type Rocket_Radio_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Radio_Status_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Radio_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Radio_Status_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  fixed?: InputMaybe<Int_Comparison_Exp>;
  noise?: InputMaybe<Int_Comparison_Exp>;
  remnoise?: InputMaybe<Int_Comparison_Exp>;
  remrssi?: InputMaybe<Int_Comparison_Exp>;
  rssi?: InputMaybe<Int_Comparison_Exp>;
  rxerrors?: InputMaybe<Int_Comparison_Exp>;
  txbuf?: InputMaybe<Int_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "rocket_radio_status" */
export type Rocket_Radio_Status_Inc_Input = {
  fixed?: InputMaybe<Scalars['Int']['input']>;
  noise?: InputMaybe<Scalars['Int']['input']>;
  remnoise?: InputMaybe<Scalars['Int']['input']>;
  remrssi?: InputMaybe<Scalars['Int']['input']>;
  rssi?: InputMaybe<Scalars['Int']['input']>;
  rxerrors?: InputMaybe<Scalars['Int']['input']>;
  txbuf?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_radio_status" */
export type Rocket_Radio_Status_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  fixed?: InputMaybe<Scalars['Int']['input']>;
  noise?: InputMaybe<Scalars['Int']['input']>;
  remnoise?: InputMaybe<Scalars['Int']['input']>;
  remrssi?: InputMaybe<Scalars['Int']['input']>;
  rssi?: InputMaybe<Scalars['Int']['input']>;
  rxerrors?: InputMaybe<Scalars['Int']['input']>;
  txbuf?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Radio_Status_Max_Fields = {
  __typename?: 'rocket_radio_status_max_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  fixed?: Maybe<Scalars['Int']['output']>;
  noise?: Maybe<Scalars['Int']['output']>;
  remnoise?: Maybe<Scalars['Int']['output']>;
  remrssi?: Maybe<Scalars['Int']['output']>;
  rssi?: Maybe<Scalars['Int']['output']>;
  rxerrors?: Maybe<Scalars['Int']['output']>;
  txbuf?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Radio_Status_Min_Fields = {
  __typename?: 'rocket_radio_status_min_fields';
  created_at?: Maybe<Scalars['timestamp']['output']>;
  fixed?: Maybe<Scalars['Int']['output']>;
  noise?: Maybe<Scalars['Int']['output']>;
  remnoise?: Maybe<Scalars['Int']['output']>;
  remrssi?: Maybe<Scalars['Int']['output']>;
  rssi?: Maybe<Scalars['Int']['output']>;
  rxerrors?: Maybe<Scalars['Int']['output']>;
  txbuf?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_radio_status" */
export type Rocket_Radio_Status_Mutation_Response = {
  __typename?: 'rocket_radio_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Radio_Status>;
};

/** Ordering options when selecting data from "rocket_radio_status". */
export type Rocket_Radio_Status_Order_By = {
  created_at?: InputMaybe<Order_By>;
  fixed?: InputMaybe<Order_By>;
  noise?: InputMaybe<Order_By>;
  remnoise?: InputMaybe<Order_By>;
  remrssi?: InputMaybe<Order_By>;
  rssi?: InputMaybe<Order_By>;
  rxerrors?: InputMaybe<Order_By>;
  txbuf?: InputMaybe<Order_By>;
};

/** select columns of table "rocket_radio_status" */
export enum Rocket_Radio_Status_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Fixed = 'fixed',
  /** column name */
  Noise = 'noise',
  /** column name */
  Remnoise = 'remnoise',
  /** column name */
  Remrssi = 'remrssi',
  /** column name */
  Rssi = 'rssi',
  /** column name */
  Rxerrors = 'rxerrors',
  /** column name */
  Txbuf = 'txbuf'
}

/** input type for updating data in table "rocket_radio_status" */
export type Rocket_Radio_Status_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  fixed?: InputMaybe<Scalars['Int']['input']>;
  noise?: InputMaybe<Scalars['Int']['input']>;
  remnoise?: InputMaybe<Scalars['Int']['input']>;
  remrssi?: InputMaybe<Scalars['Int']['input']>;
  rssi?: InputMaybe<Scalars['Int']['input']>;
  rxerrors?: InputMaybe<Scalars['Int']['input']>;
  txbuf?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Radio_Status_Stddev_Fields = {
  __typename?: 'rocket_radio_status_stddev_fields';
  fixed?: Maybe<Scalars['Float']['output']>;
  noise?: Maybe<Scalars['Float']['output']>;
  remnoise?: Maybe<Scalars['Float']['output']>;
  remrssi?: Maybe<Scalars['Float']['output']>;
  rssi?: Maybe<Scalars['Float']['output']>;
  rxerrors?: Maybe<Scalars['Float']['output']>;
  txbuf?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Radio_Status_Stddev_Pop_Fields = {
  __typename?: 'rocket_radio_status_stddev_pop_fields';
  fixed?: Maybe<Scalars['Float']['output']>;
  noise?: Maybe<Scalars['Float']['output']>;
  remnoise?: Maybe<Scalars['Float']['output']>;
  remrssi?: Maybe<Scalars['Float']['output']>;
  rssi?: Maybe<Scalars['Float']['output']>;
  rxerrors?: Maybe<Scalars['Float']['output']>;
  txbuf?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Radio_Status_Stddev_Samp_Fields = {
  __typename?: 'rocket_radio_status_stddev_samp_fields';
  fixed?: Maybe<Scalars['Float']['output']>;
  noise?: Maybe<Scalars['Float']['output']>;
  remnoise?: Maybe<Scalars['Float']['output']>;
  remrssi?: Maybe<Scalars['Float']['output']>;
  rssi?: Maybe<Scalars['Float']['output']>;
  rxerrors?: Maybe<Scalars['Float']['output']>;
  txbuf?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_radio_status" */
export type Rocket_Radio_Status_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Radio_Status_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Radio_Status_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamp']['input']>;
  fixed?: InputMaybe<Scalars['Int']['input']>;
  noise?: InputMaybe<Scalars['Int']['input']>;
  remnoise?: InputMaybe<Scalars['Int']['input']>;
  remrssi?: InputMaybe<Scalars['Int']['input']>;
  rssi?: InputMaybe<Scalars['Int']['input']>;
  rxerrors?: InputMaybe<Scalars['Int']['input']>;
  txbuf?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Radio_Status_Sum_Fields = {
  __typename?: 'rocket_radio_status_sum_fields';
  fixed?: Maybe<Scalars['Int']['output']>;
  noise?: Maybe<Scalars['Int']['output']>;
  remnoise?: Maybe<Scalars['Int']['output']>;
  remrssi?: Maybe<Scalars['Int']['output']>;
  rssi?: Maybe<Scalars['Int']['output']>;
  rxerrors?: Maybe<Scalars['Int']['output']>;
  txbuf?: Maybe<Scalars['Int']['output']>;
};

export type Rocket_Radio_Status_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Radio_Status_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Radio_Status_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Radio_Status_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Radio_Status_Var_Pop_Fields = {
  __typename?: 'rocket_radio_status_var_pop_fields';
  fixed?: Maybe<Scalars['Float']['output']>;
  noise?: Maybe<Scalars['Float']['output']>;
  remnoise?: Maybe<Scalars['Float']['output']>;
  remrssi?: Maybe<Scalars['Float']['output']>;
  rssi?: Maybe<Scalars['Float']['output']>;
  rxerrors?: Maybe<Scalars['Float']['output']>;
  txbuf?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Radio_Status_Var_Samp_Fields = {
  __typename?: 'rocket_radio_status_var_samp_fields';
  fixed?: Maybe<Scalars['Float']['output']>;
  noise?: Maybe<Scalars['Float']['output']>;
  remnoise?: Maybe<Scalars['Float']['output']>;
  remrssi?: Maybe<Scalars['Float']['output']>;
  rssi?: Maybe<Scalars['Float']['output']>;
  rxerrors?: Maybe<Scalars['Float']['output']>;
  txbuf?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Radio_Status_Variance_Fields = {
  __typename?: 'rocket_radio_status_variance_fields';
  fixed?: Maybe<Scalars['Float']['output']>;
  noise?: Maybe<Scalars['Float']['output']>;
  remnoise?: Maybe<Scalars['Float']['output']>;
  remrssi?: Maybe<Scalars['Float']['output']>;
  rssi?: Maybe<Scalars['Float']['output']>;
  rxerrors?: Maybe<Scalars['Float']['output']>;
  txbuf?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_sensor_air" */
export type Rocket_Sensor_Air = {
  __typename?: 'rocket_sensor_air';
  air_temperature: Scalars['Float']['output'];
  altitude: Scalars['Float']['output'];
  pressure_abs: Scalars['Float']['output'];
  pressure_diff: Scalars['Float']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  time_stamp: Scalars['Int']['output'];
  true_airspeed: Scalars['Float']['output'];
};

/** aggregated selection of "rocket_sensor_air" */
export type Rocket_Sensor_Air_Aggregate = {
  __typename?: 'rocket_sensor_air_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Air_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Air>;
};

/** aggregate fields of "rocket_sensor_air" */
export type Rocket_Sensor_Air_Aggregate_Fields = {
  __typename?: 'rocket_sensor_air_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Air_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Air_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Air_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Air_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Air_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Air_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Air_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Air_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Air_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Air_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_air" */
export type Rocket_Sensor_Air_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Air_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Air_Avg_Fields = {
  __typename?: 'rocket_sensor_air_avg_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_air". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Air_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Air_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Air_Bool_Exp>>;
  air_temperature?: InputMaybe<Float_Comparison_Exp>;
  altitude?: InputMaybe<Float_Comparison_Exp>;
  pressure_abs?: InputMaybe<Float_Comparison_Exp>;
  pressure_diff?: InputMaybe<Float_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
  true_airspeed?: InputMaybe<Float_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_air" */
export enum Rocket_Sensor_Air_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorAirPkey = 'rocket_sensor_air_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_air" */
export type Rocket_Sensor_Air_Inc_Input = {
  air_temperature?: InputMaybe<Scalars['Float']['input']>;
  altitude?: InputMaybe<Scalars['Float']['input']>;
  pressure_abs?: InputMaybe<Scalars['Float']['input']>;
  pressure_diff?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  true_airspeed?: InputMaybe<Scalars['Float']['input']>;
};

/** input type for inserting data into table "rocket_sensor_air" */
export type Rocket_Sensor_Air_Insert_Input = {
  air_temperature?: InputMaybe<Scalars['Float']['input']>;
  altitude?: InputMaybe<Scalars['Float']['input']>;
  pressure_abs?: InputMaybe<Scalars['Float']['input']>;
  pressure_diff?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  true_airspeed?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Air_Max_Fields = {
  __typename?: 'rocket_sensor_air_max_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Air_Min_Fields = {
  __typename?: 'rocket_sensor_air_min_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** response of any mutation on the table "rocket_sensor_air" */
export type Rocket_Sensor_Air_Mutation_Response = {
  __typename?: 'rocket_sensor_air_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Air>;
};

/** input type for inserting object relation for remote table "rocket_sensor_air" */
export type Rocket_Sensor_Air_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Air_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Air_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_air" */
export type Rocket_Sensor_Air_On_Conflict = {
  constraint: Rocket_Sensor_Air_Constraint;
  update_columns?: Array<Rocket_Sensor_Air_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_air". */
export type Rocket_Sensor_Air_Order_By = {
  air_temperature?: InputMaybe<Order_By>;
  altitude?: InputMaybe<Order_By>;
  pressure_abs?: InputMaybe<Order_By>;
  pressure_diff?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  true_airspeed?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_air */
export type Rocket_Sensor_Air_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_air" */
export enum Rocket_Sensor_Air_Select_Column {
  /** column name */
  AirTemperature = 'air_temperature',
  /** column name */
  Altitude = 'altitude',
  /** column name */
  PressureAbs = 'pressure_abs',
  /** column name */
  PressureDiff = 'pressure_diff',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  TrueAirspeed = 'true_airspeed'
}

/** input type for updating data in table "rocket_sensor_air" */
export type Rocket_Sensor_Air_Set_Input = {
  air_temperature?: InputMaybe<Scalars['Float']['input']>;
  altitude?: InputMaybe<Scalars['Float']['input']>;
  pressure_abs?: InputMaybe<Scalars['Float']['input']>;
  pressure_diff?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  true_airspeed?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Air_Stddev_Fields = {
  __typename?: 'rocket_sensor_air_stddev_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Air_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_air_stddev_pop_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Air_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_air_stddev_samp_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_sensor_air" */
export type Rocket_Sensor_Air_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Air_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Air_Stream_Cursor_Value_Input = {
  air_temperature?: InputMaybe<Scalars['Float']['input']>;
  altitude?: InputMaybe<Scalars['Float']['input']>;
  pressure_abs?: InputMaybe<Scalars['Float']['input']>;
  pressure_diff?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  true_airspeed?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Air_Sum_Fields = {
  __typename?: 'rocket_sensor_air_sum_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** update columns of table "rocket_sensor_air" */
export enum Rocket_Sensor_Air_Update_Column {
  /** column name */
  AirTemperature = 'air_temperature',
  /** column name */
  Altitude = 'altitude',
  /** column name */
  PressureAbs = 'pressure_abs',
  /** column name */
  PressureDiff = 'pressure_diff',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  TrueAirspeed = 'true_airspeed'
}

export type Rocket_Sensor_Air_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Air_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Air_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Air_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Air_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_air_var_pop_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Air_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_air_var_samp_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Air_Variance_Fields = {
  __typename?: 'rocket_sensor_air_variance_fields';
  air_temperature?: Maybe<Scalars['Float']['output']>;
  altitude?: Maybe<Scalars['Float']['output']>;
  pressure_abs?: Maybe<Scalars['Float']['output']>;
  pressure_diff?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  true_airspeed?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1 = {
  __typename?: 'rocket_sensor_gps_pos_1';
  altitude: Scalars['Float']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  time_of_week: Scalars['Int']['output'];
  time_stamp: Scalars['Int']['output'];
  undulation: Scalars['Float']['output'];
};

/** aggregated selection of "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Aggregate = {
  __typename?: 'rocket_sensor_gps_pos_1_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Gps_Pos_1_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Gps_Pos_1>;
};

/** aggregate fields of "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Aggregate_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Gps_Pos_1_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Gps_Pos_1_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Gps_Pos_1_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Gps_Pos_1_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Gps_Pos_1_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Gps_Pos_1_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Gps_Pos_1_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Gps_Pos_1_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Gps_Pos_1_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Gps_Pos_1_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Gps_Pos_1_Avg_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_avg_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_gps_pos_1". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Gps_Pos_1_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Bool_Exp>>;
  altitude?: InputMaybe<Float_Comparison_Exp>;
  latitude?: InputMaybe<Float_Comparison_Exp>;
  longitude?: InputMaybe<Float_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  time_of_week?: InputMaybe<Int_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
  undulation?: InputMaybe<Float_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_gps_pos_1" */
export enum Rocket_Sensor_Gps_Pos_1_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorGpsPos_1Pkey = 'rocket_sensor_gps_pos_1_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Inc_Input = {
  altitude?: InputMaybe<Scalars['Float']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** input type for inserting data into table "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Insert_Input = {
  altitude?: InputMaybe<Scalars['Float']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Gps_Pos_1_Max_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_max_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_of_week?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Gps_Pos_1_Min_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_min_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_of_week?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** response of any mutation on the table "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Mutation_Response = {
  __typename?: 'rocket_sensor_gps_pos_1_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Gps_Pos_1>;
};

/** input type for inserting object relation for remote table "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Gps_Pos_1_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Pos_1_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_On_Conflict = {
  constraint: Rocket_Sensor_Gps_Pos_1_Constraint;
  update_columns?: Array<Rocket_Sensor_Gps_Pos_1_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_gps_pos_1". */
export type Rocket_Sensor_Gps_Pos_1_Order_By = {
  altitude?: InputMaybe<Order_By>;
  latitude?: InputMaybe<Order_By>;
  longitude?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_gps_pos_1 */
export type Rocket_Sensor_Gps_Pos_1_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_gps_pos_1" */
export enum Rocket_Sensor_Gps_Pos_1_Select_Column {
  /** column name */
  Altitude = 'altitude',
  /** column name */
  Latitude = 'latitude',
  /** column name */
  Longitude = 'longitude',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeOfWeek = 'time_of_week',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Undulation = 'undulation'
}

/** input type for updating data in table "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Set_Input = {
  altitude?: InputMaybe<Scalars['Float']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Gps_Pos_1_Stddev_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_stddev_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Gps_Pos_1_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_stddev_pop_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Gps_Pos_1_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_stddev_samp_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_sensor_gps_pos_1" */
export type Rocket_Sensor_Gps_Pos_1_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Gps_Pos_1_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Gps_Pos_1_Stream_Cursor_Value_Input = {
  altitude?: InputMaybe<Scalars['Float']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Gps_Pos_1_Sum_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_sum_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_of_week?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** update columns of table "rocket_sensor_gps_pos_1" */
export enum Rocket_Sensor_Gps_Pos_1_Update_Column {
  /** column name */
  Altitude = 'altitude',
  /** column name */
  Latitude = 'latitude',
  /** column name */
  Longitude = 'longitude',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeOfWeek = 'time_of_week',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Undulation = 'undulation'
}

export type Rocket_Sensor_Gps_Pos_1_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Gps_Pos_1_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Gps_Pos_1_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_var_pop_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Gps_Pos_1_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_var_samp_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Gps_Pos_1_Variance_Fields = {
  __typename?: 'rocket_sensor_gps_pos_1_variance_fields';
  altitude?: Maybe<Scalars['Float']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2 = {
  __typename?: 'rocket_sensor_gps_pos_2';
  altitude_accuracy: Scalars['Float']['output'];
  base_station_id: Scalars['Int']['output'];
  differential_age: Scalars['Int']['output'];
  latitude_accuracy: Scalars['Float']['output'];
  longitude_accuracy: Scalars['Float']['output'];
  num_sv_used: Scalars['Int']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Aggregate = {
  __typename?: 'rocket_sensor_gps_pos_2_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Gps_Pos_2_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Gps_Pos_2>;
};

/** aggregate fields of "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Aggregate_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Gps_Pos_2_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Gps_Pos_2_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Gps_Pos_2_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Gps_Pos_2_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Gps_Pos_2_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Gps_Pos_2_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Gps_Pos_2_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Gps_Pos_2_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Gps_Pos_2_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Gps_Pos_2_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Gps_Pos_2_Avg_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_avg_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Float']['output']>;
  differential_age?: Maybe<Scalars['Float']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_gps_pos_2". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Gps_Pos_2_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Bool_Exp>>;
  altitude_accuracy?: InputMaybe<Float_Comparison_Exp>;
  base_station_id?: InputMaybe<Int_Comparison_Exp>;
  differential_age?: InputMaybe<Int_Comparison_Exp>;
  latitude_accuracy?: InputMaybe<Float_Comparison_Exp>;
  longitude_accuracy?: InputMaybe<Float_Comparison_Exp>;
  num_sv_used?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_gps_pos_2" */
export enum Rocket_Sensor_Gps_Pos_2_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorGpsPos_2Pkey = 'rocket_sensor_gps_pos_2_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Inc_Input = {
  altitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  base_station_id?: InputMaybe<Scalars['Int']['input']>;
  differential_age?: InputMaybe<Scalars['Int']['input']>;
  latitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  longitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  num_sv_used?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Insert_Input = {
  altitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  base_station_id?: InputMaybe<Scalars['Int']['input']>;
  differential_age?: InputMaybe<Scalars['Int']['input']>;
  latitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  longitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  num_sv_used?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Gps_Pos_2_Max_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_max_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Int']['output']>;
  differential_age?: Maybe<Scalars['Int']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Gps_Pos_2_Min_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_min_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Int']['output']>;
  differential_age?: Maybe<Scalars['Int']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Mutation_Response = {
  __typename?: 'rocket_sensor_gps_pos_2_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Gps_Pos_2>;
};

/** input type for inserting object relation for remote table "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Gps_Pos_2_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Pos_2_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_On_Conflict = {
  constraint: Rocket_Sensor_Gps_Pos_2_Constraint;
  update_columns?: Array<Rocket_Sensor_Gps_Pos_2_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_gps_pos_2". */
export type Rocket_Sensor_Gps_Pos_2_Order_By = {
  altitude_accuracy?: InputMaybe<Order_By>;
  base_station_id?: InputMaybe<Order_By>;
  differential_age?: InputMaybe<Order_By>;
  latitude_accuracy?: InputMaybe<Order_By>;
  longitude_accuracy?: InputMaybe<Order_By>;
  num_sv_used?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_gps_pos_2 */
export type Rocket_Sensor_Gps_Pos_2_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_gps_pos_2" */
export enum Rocket_Sensor_Gps_Pos_2_Select_Column {
  /** column name */
  AltitudeAccuracy = 'altitude_accuracy',
  /** column name */
  BaseStationId = 'base_station_id',
  /** column name */
  DifferentialAge = 'differential_age',
  /** column name */
  LatitudeAccuracy = 'latitude_accuracy',
  /** column name */
  LongitudeAccuracy = 'longitude_accuracy',
  /** column name */
  NumSvUsed = 'num_sv_used',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id'
}

/** input type for updating data in table "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Set_Input = {
  altitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  base_station_id?: InputMaybe<Scalars['Int']['input']>;
  differential_age?: InputMaybe<Scalars['Int']['input']>;
  latitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  longitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  num_sv_used?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Gps_Pos_2_Stddev_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_stddev_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Float']['output']>;
  differential_age?: Maybe<Scalars['Float']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Gps_Pos_2_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_stddev_pop_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Float']['output']>;
  differential_age?: Maybe<Scalars['Float']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Gps_Pos_2_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_stddev_samp_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Float']['output']>;
  differential_age?: Maybe<Scalars['Float']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_sensor_gps_pos_2" */
export type Rocket_Sensor_Gps_Pos_2_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Gps_Pos_2_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Gps_Pos_2_Stream_Cursor_Value_Input = {
  altitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  base_station_id?: InputMaybe<Scalars['Int']['input']>;
  differential_age?: InputMaybe<Scalars['Int']['input']>;
  latitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  longitude_accuracy?: InputMaybe<Scalars['Float']['input']>;
  num_sv_used?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Gps_Pos_2_Sum_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_sum_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Int']['output']>;
  differential_age?: Maybe<Scalars['Int']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_sensor_gps_pos_2" */
export enum Rocket_Sensor_Gps_Pos_2_Update_Column {
  /** column name */
  AltitudeAccuracy = 'altitude_accuracy',
  /** column name */
  BaseStationId = 'base_station_id',
  /** column name */
  DifferentialAge = 'differential_age',
  /** column name */
  LatitudeAccuracy = 'latitude_accuracy',
  /** column name */
  LongitudeAccuracy = 'longitude_accuracy',
  /** column name */
  NumSvUsed = 'num_sv_used',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id'
}

export type Rocket_Sensor_Gps_Pos_2_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Gps_Pos_2_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Gps_Pos_2_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_var_pop_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Float']['output']>;
  differential_age?: Maybe<Scalars['Float']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Gps_Pos_2_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_var_samp_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Float']['output']>;
  differential_age?: Maybe<Scalars['Float']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Gps_Pos_2_Variance_Fields = {
  __typename?: 'rocket_sensor_gps_pos_2_variance_fields';
  altitude_accuracy?: Maybe<Scalars['Float']['output']>;
  base_station_id?: Maybe<Scalars['Float']['output']>;
  differential_age?: Maybe<Scalars['Float']['output']>;
  latitude_accuracy?: Maybe<Scalars['Float']['output']>;
  longitude_accuracy?: Maybe<Scalars['Float']['output']>;
  num_sv_used?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel = {
  __typename?: 'rocket_sensor_gps_vel';
  course: Scalars['Float']['output'];
  course_acc: Scalars['Float']['output'];
  /** An object relationship */
  dataVec3ByVelocity: Data_Vec3;
  /** An object relationship */
  data_vec3: Data_Vec3;
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  time_of_week: Scalars['Int']['output'];
  time_stamp: Scalars['Int']['output'];
  velocity: Scalars['Int']['output'];
  velocity_acc: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Aggregate = {
  __typename?: 'rocket_sensor_gps_vel_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Gps_Vel_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Gps_Vel>;
};

export type Rocket_Sensor_Gps_Vel_Aggregate_Bool_Exp = {
  count?: InputMaybe<Rocket_Sensor_Gps_Vel_Aggregate_Bool_Exp_Count>;
};

export type Rocket_Sensor_Gps_Vel_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Aggregate_Fields = {
  __typename?: 'rocket_sensor_gps_vel_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Gps_Vel_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Gps_Vel_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Gps_Vel_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Gps_Vel_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Gps_Vel_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Gps_Vel_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Gps_Vel_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Gps_Vel_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Gps_Vel_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Gps_Vel_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Aggregate_Order_By = {
  avg?: InputMaybe<Rocket_Sensor_Gps_Vel_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Rocket_Sensor_Gps_Vel_Max_Order_By>;
  min?: InputMaybe<Rocket_Sensor_Gps_Vel_Min_Order_By>;
  stddev?: InputMaybe<Rocket_Sensor_Gps_Vel_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Rocket_Sensor_Gps_Vel_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Rocket_Sensor_Gps_Vel_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Rocket_Sensor_Gps_Vel_Sum_Order_By>;
  var_pop?: InputMaybe<Rocket_Sensor_Gps_Vel_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Rocket_Sensor_Gps_Vel_Var_Samp_Order_By>;
  variance?: InputMaybe<Rocket_Sensor_Gps_Vel_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Arr_Rel_Insert_Input = {
  data: Array<Rocket_Sensor_Gps_Vel_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Vel_On_Conflict>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Gps_Vel_Avg_Fields = {
  __typename?: 'rocket_sensor_gps_vel_avg_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_acc?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Avg_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_gps_vel". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Gps_Vel_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Bool_Exp>>;
  course?: InputMaybe<Float_Comparison_Exp>;
  course_acc?: InputMaybe<Float_Comparison_Exp>;
  dataVec3ByVelocity?: InputMaybe<Data_Vec3_Bool_Exp>;
  data_vec3?: InputMaybe<Data_Vec3_Bool_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  time_of_week?: InputMaybe<Int_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
  velocity?: InputMaybe<Int_Comparison_Exp>;
  velocity_acc?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_gps_vel" */
export enum Rocket_Sensor_Gps_Vel_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorGpsVelPkey = 'rocket_sensor_gps_vel_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Inc_Input = {
  course?: InputMaybe<Scalars['Float']['input']>;
  course_acc?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_acc?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Insert_Input = {
  course?: InputMaybe<Scalars['Float']['input']>;
  course_acc?: InputMaybe<Scalars['Float']['input']>;
  dataVec3ByVelocity?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  data_vec3?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_acc?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Gps_Vel_Max_Fields = {
  __typename?: 'rocket_sensor_gps_vel_max_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_of_week?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  velocity?: Maybe<Scalars['Int']['output']>;
  velocity_acc?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Max_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Gps_Vel_Min_Fields = {
  __typename?: 'rocket_sensor_gps_vel_min_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_of_week?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  velocity?: Maybe<Scalars['Int']['output']>;
  velocity_acc?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Min_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Mutation_Response = {
  __typename?: 'rocket_sensor_gps_vel_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Gps_Vel>;
};

/** input type for inserting object relation for remote table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Gps_Vel_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Gps_Vel_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_On_Conflict = {
  constraint: Rocket_Sensor_Gps_Vel_Constraint;
  update_columns?: Array<Rocket_Sensor_Gps_Vel_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_gps_vel". */
export type Rocket_Sensor_Gps_Vel_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  dataVec3ByVelocity?: InputMaybe<Data_Vec3_Order_By>;
  data_vec3?: InputMaybe<Data_Vec3_Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_gps_vel */
export type Rocket_Sensor_Gps_Vel_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_gps_vel" */
export enum Rocket_Sensor_Gps_Vel_Select_Column {
  /** column name */
  Course = 'course',
  /** column name */
  CourseAcc = 'course_acc',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeOfWeek = 'time_of_week',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Velocity = 'velocity',
  /** column name */
  VelocityAcc = 'velocity_acc'
}

/** input type for updating data in table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Set_Input = {
  course?: InputMaybe<Scalars['Float']['input']>;
  course_acc?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_acc?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Gps_Vel_Stddev_Fields = {
  __typename?: 'rocket_sensor_gps_vel_stddev_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_acc?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Stddev_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Gps_Vel_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_gps_vel_stddev_pop_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_acc?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Stddev_Pop_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Gps_Vel_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_gps_vel_stddev_samp_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_acc?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Stddev_Samp_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Gps_Vel_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Gps_Vel_Stream_Cursor_Value_Input = {
  course?: InputMaybe<Scalars['Float']['input']>;
  course_acc?: InputMaybe<Scalars['Float']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_of_week?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_acc?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Gps_Vel_Sum_Fields = {
  __typename?: 'rocket_sensor_gps_vel_sum_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_of_week?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  velocity?: Maybe<Scalars['Int']['output']>;
  velocity_acc?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Sum_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** update columns of table "rocket_sensor_gps_vel" */
export enum Rocket_Sensor_Gps_Vel_Update_Column {
  /** column name */
  Course = 'course',
  /** column name */
  CourseAcc = 'course_acc',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeOfWeek = 'time_of_week',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Velocity = 'velocity',
  /** column name */
  VelocityAcc = 'velocity_acc'
}

export type Rocket_Sensor_Gps_Vel_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Gps_Vel_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Gps_Vel_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Gps_Vel_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Gps_Vel_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_gps_vel_var_pop_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_acc?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Var_Pop_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Gps_Vel_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_gps_vel_var_samp_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_acc?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Var_Samp_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Gps_Vel_Variance_Fields = {
  __typename?: 'rocket_sensor_gps_vel_variance_fields';
  course?: Maybe<Scalars['Float']['output']>;
  course_acc?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_of_week?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_acc?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "rocket_sensor_gps_vel" */
export type Rocket_Sensor_Gps_Vel_Variance_Order_By = {
  course?: InputMaybe<Order_By>;
  course_acc?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_of_week?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_acc?: InputMaybe<Order_By>;
};

/** columns and relationships of "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1 = {
  __typename?: 'rocket_sensor_imu_1';
  accelerometers: Scalars['Int']['output'];
  /** An object relationship */
  dataVec3ByGyroscopes: Data_Vec3;
  /** An object relationship */
  data_vec3: Data_Vec3;
  gyroscopes: Scalars['Int']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  time_stamp: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Aggregate = {
  __typename?: 'rocket_sensor_imu_1_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Imu_1_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Imu_1>;
};

export type Rocket_Sensor_Imu_1_Aggregate_Bool_Exp = {
  count?: InputMaybe<Rocket_Sensor_Imu_1_Aggregate_Bool_Exp_Count>;
};

export type Rocket_Sensor_Imu_1_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Aggregate_Fields = {
  __typename?: 'rocket_sensor_imu_1_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Imu_1_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Imu_1_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Imu_1_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Imu_1_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Imu_1_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Imu_1_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Imu_1_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Imu_1_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Imu_1_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Imu_1_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Aggregate_Order_By = {
  avg?: InputMaybe<Rocket_Sensor_Imu_1_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Rocket_Sensor_Imu_1_Max_Order_By>;
  min?: InputMaybe<Rocket_Sensor_Imu_1_Min_Order_By>;
  stddev?: InputMaybe<Rocket_Sensor_Imu_1_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Rocket_Sensor_Imu_1_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Rocket_Sensor_Imu_1_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Rocket_Sensor_Imu_1_Sum_Order_By>;
  var_pop?: InputMaybe<Rocket_Sensor_Imu_1_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Rocket_Sensor_Imu_1_Var_Samp_Order_By>;
  variance?: InputMaybe<Rocket_Sensor_Imu_1_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Arr_Rel_Insert_Input = {
  data: Array<Rocket_Sensor_Imu_1_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_1_On_Conflict>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Imu_1_Avg_Fields = {
  __typename?: 'rocket_sensor_imu_1_avg_fields';
  accelerometers?: Maybe<Scalars['Float']['output']>;
  gyroscopes?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Avg_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_imu_1". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Imu_1_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Imu_1_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Imu_1_Bool_Exp>>;
  accelerometers?: InputMaybe<Int_Comparison_Exp>;
  dataVec3ByGyroscopes?: InputMaybe<Data_Vec3_Bool_Exp>;
  data_vec3?: InputMaybe<Data_Vec3_Bool_Exp>;
  gyroscopes?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_imu_1" */
export enum Rocket_Sensor_Imu_1_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorImu_1Pkey = 'rocket_sensor_imu_1_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Inc_Input = {
  accelerometers?: InputMaybe<Scalars['Int']['input']>;
  gyroscopes?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Insert_Input = {
  accelerometers?: InputMaybe<Scalars['Int']['input']>;
  dataVec3ByGyroscopes?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  data_vec3?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  gyroscopes?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Imu_1_Max_Fields = {
  __typename?: 'rocket_sensor_imu_1_max_fields';
  accelerometers?: Maybe<Scalars['Int']['output']>;
  gyroscopes?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Max_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Imu_1_Min_Fields = {
  __typename?: 'rocket_sensor_imu_1_min_fields';
  accelerometers?: Maybe<Scalars['Int']['output']>;
  gyroscopes?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Min_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Mutation_Response = {
  __typename?: 'rocket_sensor_imu_1_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Imu_1>;
};

/** input type for inserting object relation for remote table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Imu_1_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_1_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_On_Conflict = {
  constraint: Rocket_Sensor_Imu_1_Constraint;
  update_columns?: Array<Rocket_Sensor_Imu_1_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_imu_1". */
export type Rocket_Sensor_Imu_1_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  dataVec3ByGyroscopes?: InputMaybe<Data_Vec3_Order_By>;
  data_vec3?: InputMaybe<Data_Vec3_Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_imu_1 */
export type Rocket_Sensor_Imu_1_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_imu_1" */
export enum Rocket_Sensor_Imu_1_Select_Column {
  /** column name */
  Accelerometers = 'accelerometers',
  /** column name */
  Gyroscopes = 'gyroscopes',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp'
}

/** input type for updating data in table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Set_Input = {
  accelerometers?: InputMaybe<Scalars['Int']['input']>;
  gyroscopes?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Imu_1_Stddev_Fields = {
  __typename?: 'rocket_sensor_imu_1_stddev_fields';
  accelerometers?: Maybe<Scalars['Float']['output']>;
  gyroscopes?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Stddev_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Imu_1_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_imu_1_stddev_pop_fields';
  accelerometers?: Maybe<Scalars['Float']['output']>;
  gyroscopes?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Stddev_Pop_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Imu_1_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_imu_1_stddev_samp_fields';
  accelerometers?: Maybe<Scalars['Float']['output']>;
  gyroscopes?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Stddev_Samp_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Imu_1_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Imu_1_Stream_Cursor_Value_Input = {
  accelerometers?: InputMaybe<Scalars['Int']['input']>;
  gyroscopes?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Imu_1_Sum_Fields = {
  __typename?: 'rocket_sensor_imu_1_sum_fields';
  accelerometers?: Maybe<Scalars['Int']['output']>;
  gyroscopes?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Sum_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** update columns of table "rocket_sensor_imu_1" */
export enum Rocket_Sensor_Imu_1_Update_Column {
  /** column name */
  Accelerometers = 'accelerometers',
  /** column name */
  Gyroscopes = 'gyroscopes',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp'
}

export type Rocket_Sensor_Imu_1_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Imu_1_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Imu_1_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Imu_1_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Imu_1_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_imu_1_var_pop_fields';
  accelerometers?: Maybe<Scalars['Float']['output']>;
  gyroscopes?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Var_Pop_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Imu_1_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_imu_1_var_samp_fields';
  accelerometers?: Maybe<Scalars['Float']['output']>;
  gyroscopes?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Var_Samp_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Imu_1_Variance_Fields = {
  __typename?: 'rocket_sensor_imu_1_variance_fields';
  accelerometers?: Maybe<Scalars['Float']['output']>;
  gyroscopes?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "rocket_sensor_imu_1" */
export type Rocket_Sensor_Imu_1_Variance_Order_By = {
  accelerometers?: InputMaybe<Order_By>;
  gyroscopes?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** columns and relationships of "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2 = {
  __typename?: 'rocket_sensor_imu_2';
  /** An object relationship */
  dataVec3ByDeltaVelocity: Data_Vec3;
  /** An object relationship */
  data_vec3: Data_Vec3;
  delta_angle: Scalars['Int']['output'];
  delta_velocity: Scalars['Int']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  temperature: Scalars['Float']['output'];
};

/** aggregated selection of "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Aggregate = {
  __typename?: 'rocket_sensor_imu_2_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Imu_2_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Imu_2>;
};

export type Rocket_Sensor_Imu_2_Aggregate_Bool_Exp = {
  count?: InputMaybe<Rocket_Sensor_Imu_2_Aggregate_Bool_Exp_Count>;
};

export type Rocket_Sensor_Imu_2_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Aggregate_Fields = {
  __typename?: 'rocket_sensor_imu_2_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Imu_2_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Imu_2_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Imu_2_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Imu_2_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Imu_2_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Imu_2_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Imu_2_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Imu_2_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Imu_2_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Imu_2_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Aggregate_Order_By = {
  avg?: InputMaybe<Rocket_Sensor_Imu_2_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Rocket_Sensor_Imu_2_Max_Order_By>;
  min?: InputMaybe<Rocket_Sensor_Imu_2_Min_Order_By>;
  stddev?: InputMaybe<Rocket_Sensor_Imu_2_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Rocket_Sensor_Imu_2_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Rocket_Sensor_Imu_2_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Rocket_Sensor_Imu_2_Sum_Order_By>;
  var_pop?: InputMaybe<Rocket_Sensor_Imu_2_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Rocket_Sensor_Imu_2_Var_Samp_Order_By>;
  variance?: InputMaybe<Rocket_Sensor_Imu_2_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Arr_Rel_Insert_Input = {
  data: Array<Rocket_Sensor_Imu_2_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_2_On_Conflict>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Imu_2_Avg_Fields = {
  __typename?: 'rocket_sensor_imu_2_avg_fields';
  delta_angle?: Maybe<Scalars['Float']['output']>;
  delta_velocity?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Avg_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_imu_2". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Imu_2_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Imu_2_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Imu_2_Bool_Exp>>;
  dataVec3ByDeltaVelocity?: InputMaybe<Data_Vec3_Bool_Exp>;
  data_vec3?: InputMaybe<Data_Vec3_Bool_Exp>;
  delta_angle?: InputMaybe<Int_Comparison_Exp>;
  delta_velocity?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  temperature?: InputMaybe<Float_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_imu_2" */
export enum Rocket_Sensor_Imu_2_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorImu_2Pkey = 'rocket_sensor_imu_2_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Inc_Input = {
  delta_angle?: InputMaybe<Scalars['Int']['input']>;
  delta_velocity?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
};

/** input type for inserting data into table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Insert_Input = {
  dataVec3ByDeltaVelocity?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  data_vec3?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  delta_angle?: InputMaybe<Scalars['Int']['input']>;
  delta_velocity?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Imu_2_Max_Fields = {
  __typename?: 'rocket_sensor_imu_2_max_fields';
  delta_angle?: Maybe<Scalars['Int']['output']>;
  delta_velocity?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by max() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Max_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Imu_2_Min_Fields = {
  __typename?: 'rocket_sensor_imu_2_min_fields';
  delta_angle?: Maybe<Scalars['Int']['output']>;
  delta_velocity?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by min() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Min_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Mutation_Response = {
  __typename?: 'rocket_sensor_imu_2_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Imu_2>;
};

/** input type for inserting object relation for remote table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Imu_2_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Imu_2_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_On_Conflict = {
  constraint: Rocket_Sensor_Imu_2_Constraint;
  update_columns?: Array<Rocket_Sensor_Imu_2_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_imu_2". */
export type Rocket_Sensor_Imu_2_Order_By = {
  dataVec3ByDeltaVelocity?: InputMaybe<Data_Vec3_Order_By>;
  data_vec3?: InputMaybe<Data_Vec3_Order_By>;
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_imu_2 */
export type Rocket_Sensor_Imu_2_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_imu_2" */
export enum Rocket_Sensor_Imu_2_Select_Column {
  /** column name */
  DeltaAngle = 'delta_angle',
  /** column name */
  DeltaVelocity = 'delta_velocity',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Temperature = 'temperature'
}

/** input type for updating data in table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Set_Input = {
  delta_angle?: InputMaybe<Scalars['Int']['input']>;
  delta_velocity?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Imu_2_Stddev_Fields = {
  __typename?: 'rocket_sensor_imu_2_stddev_fields';
  delta_angle?: Maybe<Scalars['Float']['output']>;
  delta_velocity?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Stddev_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Imu_2_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_imu_2_stddev_pop_fields';
  delta_angle?: Maybe<Scalars['Float']['output']>;
  delta_velocity?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Stddev_Pop_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Imu_2_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_imu_2_stddev_samp_fields';
  delta_angle?: Maybe<Scalars['Float']['output']>;
  delta_velocity?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Stddev_Samp_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Imu_2_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Imu_2_Stream_Cursor_Value_Input = {
  delta_angle?: InputMaybe<Scalars['Int']['input']>;
  delta_velocity?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Imu_2_Sum_Fields = {
  __typename?: 'rocket_sensor_imu_2_sum_fields';
  delta_angle?: Maybe<Scalars['Int']['output']>;
  delta_velocity?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by sum() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Sum_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** update columns of table "rocket_sensor_imu_2" */
export enum Rocket_Sensor_Imu_2_Update_Column {
  /** column name */
  DeltaAngle = 'delta_angle',
  /** column name */
  DeltaVelocity = 'delta_velocity',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Temperature = 'temperature'
}

export type Rocket_Sensor_Imu_2_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Imu_2_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Imu_2_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Imu_2_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Imu_2_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_imu_2_var_pop_fields';
  delta_angle?: Maybe<Scalars['Float']['output']>;
  delta_velocity?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Var_Pop_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Imu_2_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_imu_2_var_samp_fields';
  delta_angle?: Maybe<Scalars['Float']['output']>;
  delta_velocity?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Var_Samp_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Imu_2_Variance_Fields = {
  __typename?: 'rocket_sensor_imu_2_variance_fields';
  delta_angle?: Maybe<Scalars['Float']['output']>;
  delta_velocity?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "rocket_sensor_imu_2" */
export type Rocket_Sensor_Imu_2_Variance_Order_By = {
  delta_angle?: InputMaybe<Order_By>;
  delta_velocity?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  temperature?: InputMaybe<Order_By>;
};

/** columns and relationships of "rocket_sensor_message" */
export type Rocket_Sensor_Message = {
  __typename?: 'rocket_sensor_message';
  component_id: Scalars['Int']['output'];
  /** An object relationship */
  rocket_message: Rocket_Message;
  rocket_message_id: Scalars['Int']['output'];
  /** An object relationship */
  rocket_sensor_air?: Maybe<Rocket_Sensor_Air>;
  /** An object relationship */
  rocket_sensor_gps_pos_1?: Maybe<Rocket_Sensor_Gps_Pos_1>;
  /** An object relationship */
  rocket_sensor_gps_pos_2?: Maybe<Rocket_Sensor_Gps_Pos_2>;
  /** An object relationship */
  rocket_sensor_gps_vel?: Maybe<Rocket_Sensor_Gps_Vel>;
  /** An object relationship */
  rocket_sensor_imu_1?: Maybe<Rocket_Sensor_Imu_1>;
  /** An object relationship */
  rocket_sensor_imu_2?: Maybe<Rocket_Sensor_Imu_2>;
  /** An object relationship */
  rocket_sensor_nav_1?: Maybe<Rocket_Sensor_Nav_1>;
  /** An object relationship */
  rocket_sensor_nav_2?: Maybe<Rocket_Sensor_Nav_2>;
  /** An object relationship */
  rocket_sensor_quat?: Maybe<Rocket_Sensor_Quat>;
  /** An object relationship */
  rocket_sensor_utc_time?: Maybe<Rocket_Sensor_Utc_Time>;
};

/** aggregated selection of "rocket_sensor_message" */
export type Rocket_Sensor_Message_Aggregate = {
  __typename?: 'rocket_sensor_message_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Message_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Message>;
};

/** aggregate fields of "rocket_sensor_message" */
export type Rocket_Sensor_Message_Aggregate_Fields = {
  __typename?: 'rocket_sensor_message_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Message_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Message_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Message_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Message_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Message_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Message_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Message_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Message_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Message_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Message_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_message" */
export type Rocket_Sensor_Message_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Message_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Message_Avg_Fields = {
  __typename?: 'rocket_sensor_message_avg_fields';
  component_id?: Maybe<Scalars['Float']['output']>;
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_message". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Message_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Message_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Message_Bool_Exp>>;
  component_id?: InputMaybe<Int_Comparison_Exp>;
  rocket_message?: InputMaybe<Rocket_Message_Bool_Exp>;
  rocket_message_id?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_air?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
  rocket_sensor_gps_pos_1?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
  rocket_sensor_gps_pos_2?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
  rocket_sensor_gps_vel?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
  rocket_sensor_imu_1?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
  rocket_sensor_imu_2?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
  rocket_sensor_nav_1?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
  rocket_sensor_nav_2?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
  rocket_sensor_quat?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
  rocket_sensor_utc_time?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_message" */
export enum Rocket_Sensor_Message_Constraint {
  /** unique or primary key constraint on columns "rocket_message_id" */
  RocketSensorMessagePkey = 'rocket_sensor_message_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_message" */
export type Rocket_Sensor_Message_Inc_Input = {
  component_id?: InputMaybe<Scalars['Int']['input']>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_sensor_message" */
export type Rocket_Sensor_Message_Insert_Input = {
  component_id?: InputMaybe<Scalars['Int']['input']>;
  rocket_message?: InputMaybe<Rocket_Message_Obj_Rel_Insert_Input>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_air?: InputMaybe<Rocket_Sensor_Air_Obj_Rel_Insert_Input>;
  rocket_sensor_gps_pos_1?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Obj_Rel_Insert_Input>;
  rocket_sensor_gps_pos_2?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Obj_Rel_Insert_Input>;
  rocket_sensor_gps_vel?: InputMaybe<Rocket_Sensor_Gps_Vel_Obj_Rel_Insert_Input>;
  rocket_sensor_imu_1?: InputMaybe<Rocket_Sensor_Imu_1_Obj_Rel_Insert_Input>;
  rocket_sensor_imu_2?: InputMaybe<Rocket_Sensor_Imu_2_Obj_Rel_Insert_Input>;
  rocket_sensor_nav_1?: InputMaybe<Rocket_Sensor_Nav_1_Obj_Rel_Insert_Input>;
  rocket_sensor_nav_2?: InputMaybe<Rocket_Sensor_Nav_2_Obj_Rel_Insert_Input>;
  rocket_sensor_quat?: InputMaybe<Rocket_Sensor_Quat_Obj_Rel_Insert_Input>;
  rocket_sensor_utc_time?: InputMaybe<Rocket_Sensor_Utc_Time_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Message_Max_Fields = {
  __typename?: 'rocket_sensor_message_max_fields';
  component_id?: Maybe<Scalars['Int']['output']>;
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Message_Min_Fields = {
  __typename?: 'rocket_sensor_message_min_fields';
  component_id?: Maybe<Scalars['Int']['output']>;
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_sensor_message" */
export type Rocket_Sensor_Message_Mutation_Response = {
  __typename?: 'rocket_sensor_message_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Message>;
};

/** input type for inserting object relation for remote table "rocket_sensor_message" */
export type Rocket_Sensor_Message_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Message_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Message_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_message" */
export type Rocket_Sensor_Message_On_Conflict = {
  constraint: Rocket_Sensor_Message_Constraint;
  update_columns?: Array<Rocket_Sensor_Message_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_message". */
export type Rocket_Sensor_Message_Order_By = {
  component_id?: InputMaybe<Order_By>;
  rocket_message?: InputMaybe<Rocket_Message_Order_By>;
  rocket_message_id?: InputMaybe<Order_By>;
  rocket_sensor_air?: InputMaybe<Rocket_Sensor_Air_Order_By>;
  rocket_sensor_gps_pos_1?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Order_By>;
  rocket_sensor_gps_pos_2?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Order_By>;
  rocket_sensor_gps_vel?: InputMaybe<Rocket_Sensor_Gps_Vel_Order_By>;
  rocket_sensor_imu_1?: InputMaybe<Rocket_Sensor_Imu_1_Order_By>;
  rocket_sensor_imu_2?: InputMaybe<Rocket_Sensor_Imu_2_Order_By>;
  rocket_sensor_nav_1?: InputMaybe<Rocket_Sensor_Nav_1_Order_By>;
  rocket_sensor_nav_2?: InputMaybe<Rocket_Sensor_Nav_2_Order_By>;
  rocket_sensor_quat?: InputMaybe<Rocket_Sensor_Quat_Order_By>;
  rocket_sensor_utc_time?: InputMaybe<Rocket_Sensor_Utc_Time_Order_By>;
};

/** primary key columns input for table: rocket_sensor_message */
export type Rocket_Sensor_Message_Pk_Columns_Input = {
  rocket_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_message" */
export enum Rocket_Sensor_Message_Select_Column {
  /** column name */
  ComponentId = 'component_id',
  /** column name */
  RocketMessageId = 'rocket_message_id'
}

/** input type for updating data in table "rocket_sensor_message" */
export type Rocket_Sensor_Message_Set_Input = {
  component_id?: InputMaybe<Scalars['Int']['input']>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Message_Stddev_Fields = {
  __typename?: 'rocket_sensor_message_stddev_fields';
  component_id?: Maybe<Scalars['Float']['output']>;
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Message_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_message_stddev_pop_fields';
  component_id?: Maybe<Scalars['Float']['output']>;
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Message_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_message_stddev_samp_fields';
  component_id?: Maybe<Scalars['Float']['output']>;
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_sensor_message" */
export type Rocket_Sensor_Message_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Message_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Message_Stream_Cursor_Value_Input = {
  component_id?: InputMaybe<Scalars['Int']['input']>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Message_Sum_Fields = {
  __typename?: 'rocket_sensor_message_sum_fields';
  component_id?: Maybe<Scalars['Int']['output']>;
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_sensor_message" */
export enum Rocket_Sensor_Message_Update_Column {
  /** column name */
  ComponentId = 'component_id',
  /** column name */
  RocketMessageId = 'rocket_message_id'
}

export type Rocket_Sensor_Message_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Message_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Message_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Message_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Message_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_message_var_pop_fields';
  component_id?: Maybe<Scalars['Float']['output']>;
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Message_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_message_var_samp_fields';
  component_id?: Maybe<Scalars['Float']['output']>;
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Message_Variance_Fields = {
  __typename?: 'rocket_sensor_message_variance_fields';
  component_id?: Maybe<Scalars['Float']['output']>;
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1 = {
  __typename?: 'rocket_sensor_nav_1';
  /** An object relationship */
  dataVec3ByVelocityStdDev: Data_Vec3;
  /** An object relationship */
  data_vec3: Data_Vec3;
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  time_stamp: Scalars['Int']['output'];
  velocity: Scalars['Int']['output'];
  velocity_std_dev: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Aggregate = {
  __typename?: 'rocket_sensor_nav_1_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Nav_1_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Nav_1>;
};

export type Rocket_Sensor_Nav_1_Aggregate_Bool_Exp = {
  count?: InputMaybe<Rocket_Sensor_Nav_1_Aggregate_Bool_Exp_Count>;
};

export type Rocket_Sensor_Nav_1_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Aggregate_Fields = {
  __typename?: 'rocket_sensor_nav_1_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Nav_1_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Nav_1_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Nav_1_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Nav_1_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Nav_1_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Nav_1_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Nav_1_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Nav_1_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Nav_1_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Nav_1_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Aggregate_Order_By = {
  avg?: InputMaybe<Rocket_Sensor_Nav_1_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Rocket_Sensor_Nav_1_Max_Order_By>;
  min?: InputMaybe<Rocket_Sensor_Nav_1_Min_Order_By>;
  stddev?: InputMaybe<Rocket_Sensor_Nav_1_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Rocket_Sensor_Nav_1_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Rocket_Sensor_Nav_1_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Rocket_Sensor_Nav_1_Sum_Order_By>;
  var_pop?: InputMaybe<Rocket_Sensor_Nav_1_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Rocket_Sensor_Nav_1_Var_Samp_Order_By>;
  variance?: InputMaybe<Rocket_Sensor_Nav_1_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Arr_Rel_Insert_Input = {
  data: Array<Rocket_Sensor_Nav_1_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_1_On_Conflict>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Nav_1_Avg_Fields = {
  __typename?: 'rocket_sensor_nav_1_avg_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_std_dev?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Avg_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_nav_1". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Nav_1_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Nav_1_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Nav_1_Bool_Exp>>;
  dataVec3ByVelocityStdDev?: InputMaybe<Data_Vec3_Bool_Exp>;
  data_vec3?: InputMaybe<Data_Vec3_Bool_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
  velocity?: InputMaybe<Int_Comparison_Exp>;
  velocity_std_dev?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_nav_1" */
export enum Rocket_Sensor_Nav_1_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorNav_1Pkey = 'rocket_sensor_nav_1_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Inc_Input = {
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_std_dev?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Insert_Input = {
  dataVec3ByVelocityStdDev?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  data_vec3?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_std_dev?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Nav_1_Max_Fields = {
  __typename?: 'rocket_sensor_nav_1_max_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  velocity?: Maybe<Scalars['Int']['output']>;
  velocity_std_dev?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Max_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Nav_1_Min_Fields = {
  __typename?: 'rocket_sensor_nav_1_min_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  velocity?: Maybe<Scalars['Int']['output']>;
  velocity_std_dev?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Min_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Mutation_Response = {
  __typename?: 'rocket_sensor_nav_1_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Nav_1>;
};

/** input type for inserting object relation for remote table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Nav_1_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_1_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_On_Conflict = {
  constraint: Rocket_Sensor_Nav_1_Constraint;
  update_columns?: Array<Rocket_Sensor_Nav_1_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_nav_1". */
export type Rocket_Sensor_Nav_1_Order_By = {
  dataVec3ByVelocityStdDev?: InputMaybe<Data_Vec3_Order_By>;
  data_vec3?: InputMaybe<Data_Vec3_Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_nav_1 */
export type Rocket_Sensor_Nav_1_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_nav_1" */
export enum Rocket_Sensor_Nav_1_Select_Column {
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Velocity = 'velocity',
  /** column name */
  VelocityStdDev = 'velocity_std_dev'
}

/** input type for updating data in table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Set_Input = {
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_std_dev?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Nav_1_Stddev_Fields = {
  __typename?: 'rocket_sensor_nav_1_stddev_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_std_dev?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Stddev_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Nav_1_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_nav_1_stddev_pop_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_std_dev?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Stddev_Pop_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Nav_1_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_nav_1_stddev_samp_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_std_dev?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Stddev_Samp_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Nav_1_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Nav_1_Stream_Cursor_Value_Input = {
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  velocity?: InputMaybe<Scalars['Int']['input']>;
  velocity_std_dev?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Nav_1_Sum_Fields = {
  __typename?: 'rocket_sensor_nav_1_sum_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  velocity?: Maybe<Scalars['Int']['output']>;
  velocity_std_dev?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Sum_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** update columns of table "rocket_sensor_nav_1" */
export enum Rocket_Sensor_Nav_1_Update_Column {
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Velocity = 'velocity',
  /** column name */
  VelocityStdDev = 'velocity_std_dev'
}

export type Rocket_Sensor_Nav_1_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Nav_1_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Nav_1_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Nav_1_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Nav_1_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_nav_1_var_pop_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_std_dev?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Var_Pop_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Nav_1_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_nav_1_var_samp_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_std_dev?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Var_Samp_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Nav_1_Variance_Fields = {
  __typename?: 'rocket_sensor_nav_1_variance_fields';
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  velocity?: Maybe<Scalars['Float']['output']>;
  velocity_std_dev?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "rocket_sensor_nav_1" */
export type Rocket_Sensor_Nav_1_Variance_Order_By = {
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  velocity?: InputMaybe<Order_By>;
  velocity_std_dev?: InputMaybe<Order_By>;
};

/** columns and relationships of "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2 = {
  __typename?: 'rocket_sensor_nav_2';
  /** An object relationship */
  dataVec3ByPositionStdDev: Data_Vec3;
  /** An object relationship */
  data_vec3: Data_Vec3;
  position: Scalars['Int']['output'];
  position_std_dev: Scalars['Int']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  undulation: Scalars['Float']['output'];
};

/** aggregated selection of "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Aggregate = {
  __typename?: 'rocket_sensor_nav_2_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Nav_2_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Nav_2>;
};

export type Rocket_Sensor_Nav_2_Aggregate_Bool_Exp = {
  count?: InputMaybe<Rocket_Sensor_Nav_2_Aggregate_Bool_Exp_Count>;
};

export type Rocket_Sensor_Nav_2_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Aggregate_Fields = {
  __typename?: 'rocket_sensor_nav_2_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Nav_2_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Nav_2_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Nav_2_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Nav_2_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Nav_2_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Nav_2_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Nav_2_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Nav_2_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Nav_2_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Nav_2_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Aggregate_Order_By = {
  avg?: InputMaybe<Rocket_Sensor_Nav_2_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Rocket_Sensor_Nav_2_Max_Order_By>;
  min?: InputMaybe<Rocket_Sensor_Nav_2_Min_Order_By>;
  stddev?: InputMaybe<Rocket_Sensor_Nav_2_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Rocket_Sensor_Nav_2_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Rocket_Sensor_Nav_2_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Rocket_Sensor_Nav_2_Sum_Order_By>;
  var_pop?: InputMaybe<Rocket_Sensor_Nav_2_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Rocket_Sensor_Nav_2_Var_Samp_Order_By>;
  variance?: InputMaybe<Rocket_Sensor_Nav_2_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Arr_Rel_Insert_Input = {
  data: Array<Rocket_Sensor_Nav_2_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_2_On_Conflict>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Nav_2_Avg_Fields = {
  __typename?: 'rocket_sensor_nav_2_avg_fields';
  position?: Maybe<Scalars['Float']['output']>;
  position_std_dev?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Avg_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_nav_2". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Nav_2_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Nav_2_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Nav_2_Bool_Exp>>;
  dataVec3ByPositionStdDev?: InputMaybe<Data_Vec3_Bool_Exp>;
  data_vec3?: InputMaybe<Data_Vec3_Bool_Exp>;
  position?: InputMaybe<Int_Comparison_Exp>;
  position_std_dev?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  undulation?: InputMaybe<Float_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_nav_2" */
export enum Rocket_Sensor_Nav_2_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorNav_2Pkey = 'rocket_sensor_nav_2_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Inc_Input = {
  position?: InputMaybe<Scalars['Int']['input']>;
  position_std_dev?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** input type for inserting data into table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Insert_Input = {
  dataVec3ByPositionStdDev?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  data_vec3?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  position?: InputMaybe<Scalars['Int']['input']>;
  position_std_dev?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Nav_2_Max_Fields = {
  __typename?: 'rocket_sensor_nav_2_max_fields';
  position?: Maybe<Scalars['Int']['output']>;
  position_std_dev?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by max() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Max_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Nav_2_Min_Fields = {
  __typename?: 'rocket_sensor_nav_2_min_fields';
  position?: Maybe<Scalars['Int']['output']>;
  position_std_dev?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by min() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Min_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Mutation_Response = {
  __typename?: 'rocket_sensor_nav_2_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Nav_2>;
};

/** input type for inserting object relation for remote table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Nav_2_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Nav_2_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_On_Conflict = {
  constraint: Rocket_Sensor_Nav_2_Constraint;
  update_columns?: Array<Rocket_Sensor_Nav_2_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_nav_2". */
export type Rocket_Sensor_Nav_2_Order_By = {
  dataVec3ByPositionStdDev?: InputMaybe<Data_Vec3_Order_By>;
  data_vec3?: InputMaybe<Data_Vec3_Order_By>;
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_nav_2 */
export type Rocket_Sensor_Nav_2_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_nav_2" */
export enum Rocket_Sensor_Nav_2_Select_Column {
  /** column name */
  Position = 'position',
  /** column name */
  PositionStdDev = 'position_std_dev',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  Undulation = 'undulation'
}

/** input type for updating data in table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Set_Input = {
  position?: InputMaybe<Scalars['Int']['input']>;
  position_std_dev?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Nav_2_Stddev_Fields = {
  __typename?: 'rocket_sensor_nav_2_stddev_fields';
  position?: Maybe<Scalars['Float']['output']>;
  position_std_dev?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Stddev_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Nav_2_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_nav_2_stddev_pop_fields';
  position?: Maybe<Scalars['Float']['output']>;
  position_std_dev?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Stddev_Pop_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Nav_2_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_nav_2_stddev_samp_fields';
  position?: Maybe<Scalars['Float']['output']>;
  position_std_dev?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Stddev_Samp_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Nav_2_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Nav_2_Stream_Cursor_Value_Input = {
  position?: InputMaybe<Scalars['Int']['input']>;
  position_std_dev?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  undulation?: InputMaybe<Scalars['Float']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Nav_2_Sum_Fields = {
  __typename?: 'rocket_sensor_nav_2_sum_fields';
  position?: Maybe<Scalars['Int']['output']>;
  position_std_dev?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by sum() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Sum_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** update columns of table "rocket_sensor_nav_2" */
export enum Rocket_Sensor_Nav_2_Update_Column {
  /** column name */
  Position = 'position',
  /** column name */
  PositionStdDev = 'position_std_dev',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  Undulation = 'undulation'
}

export type Rocket_Sensor_Nav_2_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Nav_2_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Nav_2_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Nav_2_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Nav_2_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_nav_2_var_pop_fields';
  position?: Maybe<Scalars['Float']['output']>;
  position_std_dev?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Var_Pop_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Nav_2_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_nav_2_var_samp_fields';
  position?: Maybe<Scalars['Float']['output']>;
  position_std_dev?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Var_Samp_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Nav_2_Variance_Fields = {
  __typename?: 'rocket_sensor_nav_2_variance_fields';
  position?: Maybe<Scalars['Float']['output']>;
  position_std_dev?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  undulation?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "rocket_sensor_nav_2" */
export type Rocket_Sensor_Nav_2_Variance_Order_By = {
  position?: InputMaybe<Order_By>;
  position_std_dev?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  undulation?: InputMaybe<Order_By>;
};

/** columns and relationships of "rocket_sensor_quat" */
export type Rocket_Sensor_Quat = {
  __typename?: 'rocket_sensor_quat';
  /** An object relationship */
  data_quaternion: Data_Quaternion;
  /** An object relationship */
  data_vec3: Data_Vec3;
  euler_std_dev: Scalars['Int']['output'];
  quaternion: Scalars['Int']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  time_stamp: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Aggregate = {
  __typename?: 'rocket_sensor_quat_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Quat_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Quat>;
};

export type Rocket_Sensor_Quat_Aggregate_Bool_Exp = {
  count?: InputMaybe<Rocket_Sensor_Quat_Aggregate_Bool_Exp_Count>;
};

export type Rocket_Sensor_Quat_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Aggregate_Fields = {
  __typename?: 'rocket_sensor_quat_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Quat_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Quat_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Quat_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Quat_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Quat_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Quat_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Quat_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Quat_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Quat_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Quat_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Aggregate_Order_By = {
  avg?: InputMaybe<Rocket_Sensor_Quat_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Rocket_Sensor_Quat_Max_Order_By>;
  min?: InputMaybe<Rocket_Sensor_Quat_Min_Order_By>;
  stddev?: InputMaybe<Rocket_Sensor_Quat_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Rocket_Sensor_Quat_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Rocket_Sensor_Quat_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Rocket_Sensor_Quat_Sum_Order_By>;
  var_pop?: InputMaybe<Rocket_Sensor_Quat_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Rocket_Sensor_Quat_Var_Samp_Order_By>;
  variance?: InputMaybe<Rocket_Sensor_Quat_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Arr_Rel_Insert_Input = {
  data: Array<Rocket_Sensor_Quat_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Quat_On_Conflict>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Quat_Avg_Fields = {
  __typename?: 'rocket_sensor_quat_avg_fields';
  euler_std_dev?: Maybe<Scalars['Float']['output']>;
  quaternion?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Avg_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_quat". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Quat_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Quat_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Quat_Bool_Exp>>;
  data_quaternion?: InputMaybe<Data_Quaternion_Bool_Exp>;
  data_vec3?: InputMaybe<Data_Vec3_Bool_Exp>;
  euler_std_dev?: InputMaybe<Int_Comparison_Exp>;
  quaternion?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_quat" */
export enum Rocket_Sensor_Quat_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorQuatPkey = 'rocket_sensor_quat_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Inc_Input = {
  euler_std_dev?: InputMaybe<Scalars['Int']['input']>;
  quaternion?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Insert_Input = {
  data_quaternion?: InputMaybe<Data_Quaternion_Obj_Rel_Insert_Input>;
  data_vec3?: InputMaybe<Data_Vec3_Obj_Rel_Insert_Input>;
  euler_std_dev?: InputMaybe<Scalars['Int']['input']>;
  quaternion?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Quat_Max_Fields = {
  __typename?: 'rocket_sensor_quat_max_fields';
  euler_std_dev?: Maybe<Scalars['Int']['output']>;
  quaternion?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** order by max() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Max_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Quat_Min_Fields = {
  __typename?: 'rocket_sensor_quat_min_fields';
  euler_std_dev?: Maybe<Scalars['Int']['output']>;
  quaternion?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** order by min() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Min_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Mutation_Response = {
  __typename?: 'rocket_sensor_quat_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Quat>;
};

/** input type for inserting object relation for remote table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Quat_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Quat_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_On_Conflict = {
  constraint: Rocket_Sensor_Quat_Constraint;
  update_columns?: Array<Rocket_Sensor_Quat_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_quat". */
export type Rocket_Sensor_Quat_Order_By = {
  data_quaternion?: InputMaybe<Data_Quaternion_Order_By>;
  data_vec3?: InputMaybe<Data_Vec3_Order_By>;
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_quat */
export type Rocket_Sensor_Quat_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_quat" */
export enum Rocket_Sensor_Quat_Select_Column {
  /** column name */
  EulerStdDev = 'euler_std_dev',
  /** column name */
  Quaternion = 'quaternion',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp'
}

/** input type for updating data in table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Set_Input = {
  euler_std_dev?: InputMaybe<Scalars['Int']['input']>;
  quaternion?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Quat_Stddev_Fields = {
  __typename?: 'rocket_sensor_quat_stddev_fields';
  euler_std_dev?: Maybe<Scalars['Float']['output']>;
  quaternion?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Stddev_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Quat_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_quat_stddev_pop_fields';
  euler_std_dev?: Maybe<Scalars['Float']['output']>;
  quaternion?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_pop() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Stddev_Pop_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Quat_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_quat_stddev_samp_fields';
  euler_std_dev?: Maybe<Scalars['Float']['output']>;
  quaternion?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev_samp() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Stddev_Samp_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Quat_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Quat_Stream_Cursor_Value_Input = {
  euler_std_dev?: InputMaybe<Scalars['Int']['input']>;
  quaternion?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Quat_Sum_Fields = {
  __typename?: 'rocket_sensor_quat_sum_fields';
  euler_std_dev?: Maybe<Scalars['Int']['output']>;
  quaternion?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Sum_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** update columns of table "rocket_sensor_quat" */
export enum Rocket_Sensor_Quat_Update_Column {
  /** column name */
  EulerStdDev = 'euler_std_dev',
  /** column name */
  Quaternion = 'quaternion',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp'
}

export type Rocket_Sensor_Quat_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Quat_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Quat_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Quat_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Quat_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_quat_var_pop_fields';
  euler_std_dev?: Maybe<Scalars['Float']['output']>;
  quaternion?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by var_pop() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Var_Pop_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Quat_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_quat_var_samp_fields';
  euler_std_dev?: Maybe<Scalars['Float']['output']>;
  quaternion?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by var_samp() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Var_Samp_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Quat_Variance_Fields = {
  __typename?: 'rocket_sensor_quat_variance_fields';
  euler_std_dev?: Maybe<Scalars['Float']['output']>;
  quaternion?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "rocket_sensor_quat" */
export type Rocket_Sensor_Quat_Variance_Order_By = {
  euler_std_dev?: InputMaybe<Order_By>;
  quaternion?: InputMaybe<Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
};

/** columns and relationships of "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time = {
  __typename?: 'rocket_sensor_utc_time';
  day: Scalars['Int']['output'];
  gps_time_of_week: Scalars['Int']['output'];
  hour: Scalars['Int']['output'];
  minute: Scalars['Int']['output'];
  month: Scalars['Int']['output'];
  nano_second: Scalars['Int']['output'];
  /** An object relationship */
  rocket_sensor_message: Rocket_Sensor_Message;
  rocket_sensor_message_id: Scalars['Int']['output'];
  second: Scalars['Int']['output'];
  status: Scalars['Int']['output'];
  time_stamp: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

/** aggregated selection of "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Aggregate = {
  __typename?: 'rocket_sensor_utc_time_aggregate';
  aggregate?: Maybe<Rocket_Sensor_Utc_Time_Aggregate_Fields>;
  nodes: Array<Rocket_Sensor_Utc_Time>;
};

/** aggregate fields of "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Aggregate_Fields = {
  __typename?: 'rocket_sensor_utc_time_aggregate_fields';
  avg?: Maybe<Rocket_Sensor_Utc_Time_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_Sensor_Utc_Time_Max_Fields>;
  min?: Maybe<Rocket_Sensor_Utc_Time_Min_Fields>;
  stddev?: Maybe<Rocket_Sensor_Utc_Time_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_Sensor_Utc_Time_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_Sensor_Utc_Time_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_Sensor_Utc_Time_Sum_Fields>;
  var_pop?: Maybe<Rocket_Sensor_Utc_Time_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_Sensor_Utc_Time_Var_Samp_Fields>;
  variance?: Maybe<Rocket_Sensor_Utc_Time_Variance_Fields>;
};


/** aggregate fields of "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_Sensor_Utc_Time_Avg_Fields = {
  __typename?: 'rocket_sensor_utc_time_avg_fields';
  day?: Maybe<Scalars['Float']['output']>;
  gps_time_of_week?: Maybe<Scalars['Float']['output']>;
  hour?: Maybe<Scalars['Float']['output']>;
  minute?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  nano_second?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  second?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_sensor_utc_time". All fields are combined with a logical 'AND'. */
export type Rocket_Sensor_Utc_Time_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Bool_Exp>>;
  _not?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Bool_Exp>>;
  day?: InputMaybe<Int_Comparison_Exp>;
  gps_time_of_week?: InputMaybe<Int_Comparison_Exp>;
  hour?: InputMaybe<Int_Comparison_Exp>;
  minute?: InputMaybe<Int_Comparison_Exp>;
  month?: InputMaybe<Int_Comparison_Exp>;
  nano_second?: InputMaybe<Int_Comparison_Exp>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
  rocket_sensor_message_id?: InputMaybe<Int_Comparison_Exp>;
  second?: InputMaybe<Int_Comparison_Exp>;
  status?: InputMaybe<Int_Comparison_Exp>;
  time_stamp?: InputMaybe<Int_Comparison_Exp>;
  year?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_sensor_utc_time" */
export enum Rocket_Sensor_Utc_Time_Constraint {
  /** unique or primary key constraint on columns "rocket_sensor_message_id" */
  RocketSensorUtcTimePkey = 'rocket_sensor_utc_time_pkey'
}

/** input type for incrementing numeric columns in table "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Inc_Input = {
  day?: InputMaybe<Scalars['Int']['input']>;
  gps_time_of_week?: InputMaybe<Scalars['Int']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  minute?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  nano_second?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  second?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Insert_Input = {
  day?: InputMaybe<Scalars['Int']['input']>;
  gps_time_of_week?: InputMaybe<Scalars['Int']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  minute?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  nano_second?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Obj_Rel_Insert_Input>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  second?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Rocket_Sensor_Utc_Time_Max_Fields = {
  __typename?: 'rocket_sensor_utc_time_max_fields';
  day?: Maybe<Scalars['Int']['output']>;
  gps_time_of_week?: Maybe<Scalars['Int']['output']>;
  hour?: Maybe<Scalars['Int']['output']>;
  minute?: Maybe<Scalars['Int']['output']>;
  month?: Maybe<Scalars['Int']['output']>;
  nano_second?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  second?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Rocket_Sensor_Utc_Time_Min_Fields = {
  __typename?: 'rocket_sensor_utc_time_min_fields';
  day?: Maybe<Scalars['Int']['output']>;
  gps_time_of_week?: Maybe<Scalars['Int']['output']>;
  hour?: Maybe<Scalars['Int']['output']>;
  minute?: Maybe<Scalars['Int']['output']>;
  month?: Maybe<Scalars['Int']['output']>;
  nano_second?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  second?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Mutation_Response = {
  __typename?: 'rocket_sensor_utc_time_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_Sensor_Utc_Time>;
};

/** input type for inserting object relation for remote table "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Obj_Rel_Insert_Input = {
  data: Rocket_Sensor_Utc_Time_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_Sensor_Utc_Time_On_Conflict>;
};

/** on_conflict condition type for table "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_On_Conflict = {
  constraint: Rocket_Sensor_Utc_Time_Constraint;
  update_columns?: Array<Rocket_Sensor_Utc_Time_Update_Column>;
  where?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_sensor_utc_time". */
export type Rocket_Sensor_Utc_Time_Order_By = {
  day?: InputMaybe<Order_By>;
  gps_time_of_week?: InputMaybe<Order_By>;
  hour?: InputMaybe<Order_By>;
  minute?: InputMaybe<Order_By>;
  month?: InputMaybe<Order_By>;
  nano_second?: InputMaybe<Order_By>;
  rocket_sensor_message?: InputMaybe<Rocket_Sensor_Message_Order_By>;
  rocket_sensor_message_id?: InputMaybe<Order_By>;
  second?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_stamp?: InputMaybe<Order_By>;
  year?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_sensor_utc_time */
export type Rocket_Sensor_Utc_Time_Pk_Columns_Input = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_sensor_utc_time" */
export enum Rocket_Sensor_Utc_Time_Select_Column {
  /** column name */
  Day = 'day',
  /** column name */
  GpsTimeOfWeek = 'gps_time_of_week',
  /** column name */
  Hour = 'hour',
  /** column name */
  Minute = 'minute',
  /** column name */
  Month = 'month',
  /** column name */
  NanoSecond = 'nano_second',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Second = 'second',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Year = 'year'
}

/** input type for updating data in table "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Set_Input = {
  day?: InputMaybe<Scalars['Int']['input']>;
  gps_time_of_week?: InputMaybe<Scalars['Int']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  minute?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  nano_second?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  second?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_Sensor_Utc_Time_Stddev_Fields = {
  __typename?: 'rocket_sensor_utc_time_stddev_fields';
  day?: Maybe<Scalars['Float']['output']>;
  gps_time_of_week?: Maybe<Scalars['Float']['output']>;
  hour?: Maybe<Scalars['Float']['output']>;
  minute?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  nano_second?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  second?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_Sensor_Utc_Time_Stddev_Pop_Fields = {
  __typename?: 'rocket_sensor_utc_time_stddev_pop_fields';
  day?: Maybe<Scalars['Float']['output']>;
  gps_time_of_week?: Maybe<Scalars['Float']['output']>;
  hour?: Maybe<Scalars['Float']['output']>;
  minute?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  nano_second?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  second?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_Sensor_Utc_Time_Stddev_Samp_Fields = {
  __typename?: 'rocket_sensor_utc_time_stddev_samp_fields';
  day?: Maybe<Scalars['Float']['output']>;
  gps_time_of_week?: Maybe<Scalars['Float']['output']>;
  hour?: Maybe<Scalars['Float']['output']>;
  minute?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  nano_second?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  second?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_sensor_utc_time" */
export type Rocket_Sensor_Utc_Time_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_Sensor_Utc_Time_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_Sensor_Utc_Time_Stream_Cursor_Value_Input = {
  day?: InputMaybe<Scalars['Int']['input']>;
  gps_time_of_week?: InputMaybe<Scalars['Int']['input']>;
  hour?: InputMaybe<Scalars['Int']['input']>;
  minute?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  nano_second?: InputMaybe<Scalars['Int']['input']>;
  rocket_sensor_message_id?: InputMaybe<Scalars['Int']['input']>;
  second?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Int']['input']>;
  time_stamp?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Rocket_Sensor_Utc_Time_Sum_Fields = {
  __typename?: 'rocket_sensor_utc_time_sum_fields';
  day?: Maybe<Scalars['Int']['output']>;
  gps_time_of_week?: Maybe<Scalars['Int']['output']>;
  hour?: Maybe<Scalars['Int']['output']>;
  minute?: Maybe<Scalars['Int']['output']>;
  month?: Maybe<Scalars['Int']['output']>;
  nano_second?: Maybe<Scalars['Int']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Int']['output']>;
  second?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  time_stamp?: Maybe<Scalars['Int']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_sensor_utc_time" */
export enum Rocket_Sensor_Utc_Time_Update_Column {
  /** column name */
  Day = 'day',
  /** column name */
  GpsTimeOfWeek = 'gps_time_of_week',
  /** column name */
  Hour = 'hour',
  /** column name */
  Minute = 'minute',
  /** column name */
  Month = 'month',
  /** column name */
  NanoSecond = 'nano_second',
  /** column name */
  RocketSensorMessageId = 'rocket_sensor_message_id',
  /** column name */
  Second = 'second',
  /** column name */
  Status = 'status',
  /** column name */
  TimeStamp = 'time_stamp',
  /** column name */
  Year = 'year'
}

export type Rocket_Sensor_Utc_Time_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_Sensor_Utc_Time_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_Sensor_Utc_Time_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_Sensor_Utc_Time_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_Sensor_Utc_Time_Var_Pop_Fields = {
  __typename?: 'rocket_sensor_utc_time_var_pop_fields';
  day?: Maybe<Scalars['Float']['output']>;
  gps_time_of_week?: Maybe<Scalars['Float']['output']>;
  hour?: Maybe<Scalars['Float']['output']>;
  minute?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  nano_second?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  second?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_Sensor_Utc_Time_Var_Samp_Fields = {
  __typename?: 'rocket_sensor_utc_time_var_samp_fields';
  day?: Maybe<Scalars['Float']['output']>;
  gps_time_of_week?: Maybe<Scalars['Float']['output']>;
  hour?: Maybe<Scalars['Float']['output']>;
  minute?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  nano_second?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  second?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_Sensor_Utc_Time_Variance_Fields = {
  __typename?: 'rocket_sensor_utc_time_variance_fields';
  day?: Maybe<Scalars['Float']['output']>;
  gps_time_of_week?: Maybe<Scalars['Float']['output']>;
  hour?: Maybe<Scalars['Float']['output']>;
  minute?: Maybe<Scalars['Float']['output']>;
  month?: Maybe<Scalars['Float']['output']>;
  nano_second?: Maybe<Scalars['Float']['output']>;
  rocket_sensor_message_id?: Maybe<Scalars['Float']['output']>;
  second?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  time_stamp?: Maybe<Scalars['Float']['output']>;
  year?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rocket_state" */
export type Rocket_State = {
  __typename?: 'rocket_state';
  /** An object relationship */
  rocket_message: Rocket_Message;
  rocket_message_id: Scalars['Int']['output'];
  state: Scalars['String']['output'];
};

/** aggregated selection of "rocket_state" */
export type Rocket_State_Aggregate = {
  __typename?: 'rocket_state_aggregate';
  aggregate?: Maybe<Rocket_State_Aggregate_Fields>;
  nodes: Array<Rocket_State>;
};

/** aggregate fields of "rocket_state" */
export type Rocket_State_Aggregate_Fields = {
  __typename?: 'rocket_state_aggregate_fields';
  avg?: Maybe<Rocket_State_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rocket_State_Max_Fields>;
  min?: Maybe<Rocket_State_Min_Fields>;
  stddev?: Maybe<Rocket_State_Stddev_Fields>;
  stddev_pop?: Maybe<Rocket_State_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rocket_State_Stddev_Samp_Fields>;
  sum?: Maybe<Rocket_State_Sum_Fields>;
  var_pop?: Maybe<Rocket_State_Var_Pop_Fields>;
  var_samp?: Maybe<Rocket_State_Var_Samp_Fields>;
  variance?: Maybe<Rocket_State_Variance_Fields>;
};


/** aggregate fields of "rocket_state" */
export type Rocket_State_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rocket_State_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rocket_State_Avg_Fields = {
  __typename?: 'rocket_state_avg_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rocket_state". All fields are combined with a logical 'AND'. */
export type Rocket_State_Bool_Exp = {
  _and?: InputMaybe<Array<Rocket_State_Bool_Exp>>;
  _not?: InputMaybe<Rocket_State_Bool_Exp>;
  _or?: InputMaybe<Array<Rocket_State_Bool_Exp>>;
  rocket_message?: InputMaybe<Rocket_Message_Bool_Exp>;
  rocket_message_id?: InputMaybe<Int_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "rocket_state" */
export enum Rocket_State_Constraint {
  /** unique or primary key constraint on columns "rocket_message_id" */
  RocketStatePkey = 'rocket_state_pkey'
}

/** input type for incrementing numeric columns in table "rocket_state" */
export type Rocket_State_Inc_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rocket_state" */
export type Rocket_State_Insert_Input = {
  rocket_message?: InputMaybe<Rocket_Message_Obj_Rel_Insert_Input>;
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Rocket_State_Max_Fields = {
  __typename?: 'rocket_state_max_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Rocket_State_Min_Fields = {
  __typename?: 'rocket_state_min_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "rocket_state" */
export type Rocket_State_Mutation_Response = {
  __typename?: 'rocket_state_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rocket_State>;
};

/** input type for inserting object relation for remote table "rocket_state" */
export type Rocket_State_Obj_Rel_Insert_Input = {
  data: Rocket_State_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Rocket_State_On_Conflict>;
};

/** on_conflict condition type for table "rocket_state" */
export type Rocket_State_On_Conflict = {
  constraint: Rocket_State_Constraint;
  update_columns?: Array<Rocket_State_Update_Column>;
  where?: InputMaybe<Rocket_State_Bool_Exp>;
};

/** Ordering options when selecting data from "rocket_state". */
export type Rocket_State_Order_By = {
  rocket_message?: InputMaybe<Rocket_Message_Order_By>;
  rocket_message_id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rocket_state */
export type Rocket_State_Pk_Columns_Input = {
  rocket_message_id: Scalars['Int']['input'];
};

/** select columns of table "rocket_state" */
export enum Rocket_State_Select_Column {
  /** column name */
  RocketMessageId = 'rocket_message_id',
  /** column name */
  State = 'state'
}

/** input type for updating data in table "rocket_state" */
export type Rocket_State_Set_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Rocket_State_Stddev_Fields = {
  __typename?: 'rocket_state_stddev_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rocket_State_Stddev_Pop_Fields = {
  __typename?: 'rocket_state_stddev_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rocket_State_Stddev_Samp_Fields = {
  __typename?: 'rocket_state_stddev_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rocket_state" */
export type Rocket_State_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rocket_State_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rocket_State_Stream_Cursor_Value_Input = {
  rocket_message_id?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Rocket_State_Sum_Fields = {
  __typename?: 'rocket_state_sum_fields';
  rocket_message_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rocket_state" */
export enum Rocket_State_Update_Column {
  /** column name */
  RocketMessageId = 'rocket_message_id',
  /** column name */
  State = 'state'
}

export type Rocket_State_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rocket_State_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rocket_State_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rocket_State_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rocket_State_Var_Pop_Fields = {
  __typename?: 'rocket_state_var_pop_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rocket_State_Var_Samp_Fields = {
  __typename?: 'rocket_state_var_samp_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rocket_State_Variance_Fields = {
  __typename?: 'rocket_state_variance_fields';
  rocket_message_id?: Maybe<Scalars['Float']['output']>;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "data_quaternion" */
  data_quaternion: Array<Data_Quaternion>;
  /** fetch aggregated fields from the table: "data_quaternion" */
  data_quaternion_aggregate: Data_Quaternion_Aggregate;
  /** fetch data from the table: "data_quaternion" using primary key columns */
  data_quaternion_by_pk?: Maybe<Data_Quaternion>;
  /** fetch data from the table in a streaming manner: "data_quaternion" */
  data_quaternion_stream: Array<Data_Quaternion>;
  /** fetch data from the table: "data_vec3" */
  data_vec3: Array<Data_Vec3>;
  /** fetch aggregated fields from the table: "data_vec3" */
  data_vec3_aggregate: Data_Vec3_Aggregate;
  /** fetch data from the table: "data_vec3" using primary key columns */
  data_vec3_by_pk?: Maybe<Data_Vec3>;
  /** fetch data from the table in a streaming manner: "data_vec3" */
  data_vec3_stream: Array<Data_Vec3>;
  /** fetch data from the table: "rocket_command" */
  rocket_command: Array<Rocket_Command>;
  /** fetch aggregated fields from the table: "rocket_command" */
  rocket_command_aggregate: Rocket_Command_Aggregate;
  /** fetch data from the table: "rocket_command" using primary key columns */
  rocket_command_by_pk?: Maybe<Rocket_Command>;
  /** fetch data from the table in a streaming manner: "rocket_command" */
  rocket_command_stream: Array<Rocket_Command>;
  /** fetch data from the table: "rocket_deploy_drogue_command" */
  rocket_deploy_drogue_command: Array<Rocket_Deploy_Drogue_Command>;
  /** fetch aggregated fields from the table: "rocket_deploy_drogue_command" */
  rocket_deploy_drogue_command_aggregate: Rocket_Deploy_Drogue_Command_Aggregate;
  /** fetch data from the table: "rocket_deploy_drogue_command" using primary key columns */
  rocket_deploy_drogue_command_by_pk?: Maybe<Rocket_Deploy_Drogue_Command>;
  /** fetch data from the table in a streaming manner: "rocket_deploy_drogue_command" */
  rocket_deploy_drogue_command_stream: Array<Rocket_Deploy_Drogue_Command>;
  /** fetch data from the table: "rocket_deploy_main_command" */
  rocket_deploy_main_command: Array<Rocket_Deploy_Main_Command>;
  /** fetch aggregated fields from the table: "rocket_deploy_main_command" */
  rocket_deploy_main_command_aggregate: Rocket_Deploy_Main_Command_Aggregate;
  /** fetch data from the table: "rocket_deploy_main_command" using primary key columns */
  rocket_deploy_main_command_by_pk?: Maybe<Rocket_Deploy_Main_Command>;
  /** fetch data from the table in a streaming manner: "rocket_deploy_main_command" */
  rocket_deploy_main_command_stream: Array<Rocket_Deploy_Main_Command>;
  /** fetch data from the table: "rocket_health" */
  rocket_health: Array<Rocket_Health>;
  /** fetch aggregated fields from the table: "rocket_health" */
  rocket_health_aggregate: Rocket_Health_Aggregate;
  /** fetch data from the table: "rocket_health" using primary key columns */
  rocket_health_by_pk?: Maybe<Rocket_Health>;
  /** fetch data from the table: "rocket_health_status" */
  rocket_health_status: Array<Rocket_Health_Status>;
  /** fetch aggregated fields from the table: "rocket_health_status" */
  rocket_health_status_aggregate: Rocket_Health_Status_Aggregate;
  /** fetch data from the table: "rocket_health_status" using primary key columns */
  rocket_health_status_by_pk?: Maybe<Rocket_Health_Status>;
  /** fetch data from the table in a streaming manner: "rocket_health_status" */
  rocket_health_status_stream: Array<Rocket_Health_Status>;
  /** fetch data from the table in a streaming manner: "rocket_health" */
  rocket_health_stream: Array<Rocket_Health>;
  /** fetch data from the table: "rocket_heartbeat" */
  rocket_heartbeat: Array<Rocket_Heartbeat>;
  /** fetch aggregated fields from the table: "rocket_heartbeat" */
  rocket_heartbeat_aggregate: Rocket_Heartbeat_Aggregate;
  /** fetch data from the table in a streaming manner: "rocket_heartbeat" */
  rocket_heartbeat_stream: Array<Rocket_Heartbeat>;
  /** fetch data from the table: "rocket_log" */
  rocket_log: Array<Rocket_Log>;
  /** fetch aggregated fields from the table: "rocket_log" */
  rocket_log_aggregate: Rocket_Log_Aggregate;
  /** fetch data from the table: "rocket_log" using primary key columns */
  rocket_log_by_pk?: Maybe<Rocket_Log>;
  /** fetch data from the table in a streaming manner: "rocket_log" */
  rocket_log_stream: Array<Rocket_Log>;
  /** fetch data from the table: "rocket_message" */
  rocket_message: Array<Rocket_Message>;
  /** fetch aggregated fields from the table: "rocket_message" */
  rocket_message_aggregate: Rocket_Message_Aggregate;
  /** fetch data from the table: "rocket_message" using primary key columns */
  rocket_message_by_pk?: Maybe<Rocket_Message>;
  /** fetch data from the table in a streaming manner: "rocket_message" */
  rocket_message_stream: Array<Rocket_Message>;
  /** fetch data from the table: "rocket_power_down_command" */
  rocket_power_down_command: Array<Rocket_Power_Down_Command>;
  /** fetch aggregated fields from the table: "rocket_power_down_command" */
  rocket_power_down_command_aggregate: Rocket_Power_Down_Command_Aggregate;
  /** fetch data from the table: "rocket_power_down_command" using primary key columns */
  rocket_power_down_command_by_pk?: Maybe<Rocket_Power_Down_Command>;
  /** fetch data from the table in a streaming manner: "rocket_power_down_command" */
  rocket_power_down_command_stream: Array<Rocket_Power_Down_Command>;
  /** fetch data from the table: "rocket_radio_rate_change_command" */
  rocket_radio_rate_change_command: Array<Rocket_Radio_Rate_Change_Command>;
  /** fetch aggregated fields from the table: "rocket_radio_rate_change_command" */
  rocket_radio_rate_change_command_aggregate: Rocket_Radio_Rate_Change_Command_Aggregate;
  /** fetch data from the table: "rocket_radio_rate_change_command" using primary key columns */
  rocket_radio_rate_change_command_by_pk?: Maybe<Rocket_Radio_Rate_Change_Command>;
  /** fetch data from the table in a streaming manner: "rocket_radio_rate_change_command" */
  rocket_radio_rate_change_command_stream: Array<Rocket_Radio_Rate_Change_Command>;
  /** fetch data from the table: "rocket_radio_status" */
  rocket_radio_status: Array<Rocket_Radio_Status>;
  /** fetch aggregated fields from the table: "rocket_radio_status" */
  rocket_radio_status_aggregate: Rocket_Radio_Status_Aggregate;
  /** fetch data from the table in a streaming manner: "rocket_radio_status" */
  rocket_radio_status_stream: Array<Rocket_Radio_Status>;
  /** fetch data from the table: "rocket_sensor_air" */
  rocket_sensor_air: Array<Rocket_Sensor_Air>;
  /** fetch aggregated fields from the table: "rocket_sensor_air" */
  rocket_sensor_air_aggregate: Rocket_Sensor_Air_Aggregate;
  /** fetch data from the table: "rocket_sensor_air" using primary key columns */
  rocket_sensor_air_by_pk?: Maybe<Rocket_Sensor_Air>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_air" */
  rocket_sensor_air_stream: Array<Rocket_Sensor_Air>;
  /** fetch data from the table: "rocket_sensor_gps_pos_1" */
  rocket_sensor_gps_pos_1: Array<Rocket_Sensor_Gps_Pos_1>;
  /** fetch aggregated fields from the table: "rocket_sensor_gps_pos_1" */
  rocket_sensor_gps_pos_1_aggregate: Rocket_Sensor_Gps_Pos_1_Aggregate;
  /** fetch data from the table: "rocket_sensor_gps_pos_1" using primary key columns */
  rocket_sensor_gps_pos_1_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_1>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_gps_pos_1" */
  rocket_sensor_gps_pos_1_stream: Array<Rocket_Sensor_Gps_Pos_1>;
  /** fetch data from the table: "rocket_sensor_gps_pos_2" */
  rocket_sensor_gps_pos_2: Array<Rocket_Sensor_Gps_Pos_2>;
  /** fetch aggregated fields from the table: "rocket_sensor_gps_pos_2" */
  rocket_sensor_gps_pos_2_aggregate: Rocket_Sensor_Gps_Pos_2_Aggregate;
  /** fetch data from the table: "rocket_sensor_gps_pos_2" using primary key columns */
  rocket_sensor_gps_pos_2_by_pk?: Maybe<Rocket_Sensor_Gps_Pos_2>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_gps_pos_2" */
  rocket_sensor_gps_pos_2_stream: Array<Rocket_Sensor_Gps_Pos_2>;
  /** fetch data from the table: "rocket_sensor_gps_vel" */
  rocket_sensor_gps_vel: Array<Rocket_Sensor_Gps_Vel>;
  /** fetch aggregated fields from the table: "rocket_sensor_gps_vel" */
  rocket_sensor_gps_vel_aggregate: Rocket_Sensor_Gps_Vel_Aggregate;
  /** fetch data from the table: "rocket_sensor_gps_vel" using primary key columns */
  rocket_sensor_gps_vel_by_pk?: Maybe<Rocket_Sensor_Gps_Vel>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_gps_vel" */
  rocket_sensor_gps_vel_stream: Array<Rocket_Sensor_Gps_Vel>;
  /** fetch data from the table: "rocket_sensor_imu_1" */
  rocket_sensor_imu_1: Array<Rocket_Sensor_Imu_1>;
  /** fetch aggregated fields from the table: "rocket_sensor_imu_1" */
  rocket_sensor_imu_1_aggregate: Rocket_Sensor_Imu_1_Aggregate;
  /** fetch data from the table: "rocket_sensor_imu_1" using primary key columns */
  rocket_sensor_imu_1_by_pk?: Maybe<Rocket_Sensor_Imu_1>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_imu_1" */
  rocket_sensor_imu_1_stream: Array<Rocket_Sensor_Imu_1>;
  /** fetch data from the table: "rocket_sensor_imu_2" */
  rocket_sensor_imu_2: Array<Rocket_Sensor_Imu_2>;
  /** fetch aggregated fields from the table: "rocket_sensor_imu_2" */
  rocket_sensor_imu_2_aggregate: Rocket_Sensor_Imu_2_Aggregate;
  /** fetch data from the table: "rocket_sensor_imu_2" using primary key columns */
  rocket_sensor_imu_2_by_pk?: Maybe<Rocket_Sensor_Imu_2>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_imu_2" */
  rocket_sensor_imu_2_stream: Array<Rocket_Sensor_Imu_2>;
  /** fetch data from the table: "rocket_sensor_message" */
  rocket_sensor_message: Array<Rocket_Sensor_Message>;
  /** fetch aggregated fields from the table: "rocket_sensor_message" */
  rocket_sensor_message_aggregate: Rocket_Sensor_Message_Aggregate;
  /** fetch data from the table: "rocket_sensor_message" using primary key columns */
  rocket_sensor_message_by_pk?: Maybe<Rocket_Sensor_Message>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_message" */
  rocket_sensor_message_stream: Array<Rocket_Sensor_Message>;
  /** fetch data from the table: "rocket_sensor_nav_1" */
  rocket_sensor_nav_1: Array<Rocket_Sensor_Nav_1>;
  /** fetch aggregated fields from the table: "rocket_sensor_nav_1" */
  rocket_sensor_nav_1_aggregate: Rocket_Sensor_Nav_1_Aggregate;
  /** fetch data from the table: "rocket_sensor_nav_1" using primary key columns */
  rocket_sensor_nav_1_by_pk?: Maybe<Rocket_Sensor_Nav_1>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_nav_1" */
  rocket_sensor_nav_1_stream: Array<Rocket_Sensor_Nav_1>;
  /** fetch data from the table: "rocket_sensor_nav_2" */
  rocket_sensor_nav_2: Array<Rocket_Sensor_Nav_2>;
  /** fetch aggregated fields from the table: "rocket_sensor_nav_2" */
  rocket_sensor_nav_2_aggregate: Rocket_Sensor_Nav_2_Aggregate;
  /** fetch data from the table: "rocket_sensor_nav_2" using primary key columns */
  rocket_sensor_nav_2_by_pk?: Maybe<Rocket_Sensor_Nav_2>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_nav_2" */
  rocket_sensor_nav_2_stream: Array<Rocket_Sensor_Nav_2>;
  /** fetch data from the table: "rocket_sensor_quat" */
  rocket_sensor_quat: Array<Rocket_Sensor_Quat>;
  /** fetch aggregated fields from the table: "rocket_sensor_quat" */
  rocket_sensor_quat_aggregate: Rocket_Sensor_Quat_Aggregate;
  /** fetch data from the table: "rocket_sensor_quat" using primary key columns */
  rocket_sensor_quat_by_pk?: Maybe<Rocket_Sensor_Quat>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_quat" */
  rocket_sensor_quat_stream: Array<Rocket_Sensor_Quat>;
  /** fetch data from the table: "rocket_sensor_utc_time" */
  rocket_sensor_utc_time: Array<Rocket_Sensor_Utc_Time>;
  /** fetch aggregated fields from the table: "rocket_sensor_utc_time" */
  rocket_sensor_utc_time_aggregate: Rocket_Sensor_Utc_Time_Aggregate;
  /** fetch data from the table: "rocket_sensor_utc_time" using primary key columns */
  rocket_sensor_utc_time_by_pk?: Maybe<Rocket_Sensor_Utc_Time>;
  /** fetch data from the table in a streaming manner: "rocket_sensor_utc_time" */
  rocket_sensor_utc_time_stream: Array<Rocket_Sensor_Utc_Time>;
  /** fetch data from the table: "rocket_state" */
  rocket_state: Array<Rocket_State>;
  /** fetch aggregated fields from the table: "rocket_state" */
  rocket_state_aggregate: Rocket_State_Aggregate;
  /** fetch data from the table: "rocket_state" using primary key columns */
  rocket_state_by_pk?: Maybe<Rocket_State>;
  /** fetch data from the table in a streaming manner: "rocket_state" */
  rocket_state_stream: Array<Rocket_State>;
};


export type Subscription_RootData_QuaternionArgs = {
  distinct_on?: InputMaybe<Array<Data_Quaternion_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Quaternion_Order_By>>;
  where?: InputMaybe<Data_Quaternion_Bool_Exp>;
};


export type Subscription_RootData_Quaternion_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Data_Quaternion_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Quaternion_Order_By>>;
  where?: InputMaybe<Data_Quaternion_Bool_Exp>;
};


export type Subscription_RootData_Quaternion_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootData_Quaternion_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Data_Quaternion_Stream_Cursor_Input>>;
  where?: InputMaybe<Data_Quaternion_Bool_Exp>;
};


export type Subscription_RootData_Vec3Args = {
  distinct_on?: InputMaybe<Array<Data_Vec3_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Vec3_Order_By>>;
  where?: InputMaybe<Data_Vec3_Bool_Exp>;
};


export type Subscription_RootData_Vec3_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Data_Vec3_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Data_Vec3_Order_By>>;
  where?: InputMaybe<Data_Vec3_Bool_Exp>;
};


export type Subscription_RootData_Vec3_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootData_Vec3_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Data_Vec3_Stream_Cursor_Input>>;
  where?: InputMaybe<Data_Vec3_Bool_Exp>;
};


export type Subscription_RootRocket_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Command_Order_By>>;
  where?: InputMaybe<Rocket_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Command_Order_By>>;
  where?: InputMaybe<Rocket_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Command_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Command_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Command_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Deploy_Drogue_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Deploy_Drogue_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Drogue_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Deploy_Drogue_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Deploy_Drogue_Command_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Deploy_Drogue_Command_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Deploy_Drogue_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Deploy_Main_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Main_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Main_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Deploy_Main_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Deploy_Main_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Deploy_Main_Command_Order_By>>;
  where?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Deploy_Main_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Deploy_Main_Command_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Deploy_Main_Command_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Deploy_Main_Command_Bool_Exp>;
};


export type Subscription_RootRocket_HealthArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Order_By>>;
  where?: InputMaybe<Rocket_Health_Bool_Exp>;
};


export type Subscription_RootRocket_Health_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Order_By>>;
  where?: InputMaybe<Rocket_Health_Bool_Exp>;
};


export type Subscription_RootRocket_Health_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Health_StatusArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Status_Order_By>>;
  where?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
};


export type Subscription_RootRocket_Health_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Health_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Health_Status_Order_By>>;
  where?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
};


export type Subscription_RootRocket_Health_Status_By_PkArgs = {
  rocket_health_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Health_Status_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Health_Status_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Health_Status_Bool_Exp>;
};


export type Subscription_RootRocket_Health_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Health_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Health_Bool_Exp>;
};


export type Subscription_RootRocket_HeartbeatArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Heartbeat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Heartbeat_Order_By>>;
  where?: InputMaybe<Rocket_Heartbeat_Bool_Exp>;
};


export type Subscription_RootRocket_Heartbeat_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Heartbeat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Heartbeat_Order_By>>;
  where?: InputMaybe<Rocket_Heartbeat_Bool_Exp>;
};


export type Subscription_RootRocket_Heartbeat_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Heartbeat_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Heartbeat_Bool_Exp>;
};


export type Subscription_RootRocket_LogArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Log_Order_By>>;
  where?: InputMaybe<Rocket_Log_Bool_Exp>;
};


export type Subscription_RootRocket_Log_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Log_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Log_Order_By>>;
  where?: InputMaybe<Rocket_Log_Bool_Exp>;
};


export type Subscription_RootRocket_Log_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Log_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Log_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Log_Bool_Exp>;
};


export type Subscription_RootRocket_MessageArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Message_Order_By>>;
  where?: InputMaybe<Rocket_Message_Bool_Exp>;
};


export type Subscription_RootRocket_Message_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Message_Order_By>>;
  where?: InputMaybe<Rocket_Message_Bool_Exp>;
};


export type Subscription_RootRocket_Message_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Message_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Message_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Message_Bool_Exp>;
};


export type Subscription_RootRocket_Power_Down_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Power_Down_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Power_Down_Command_Order_By>>;
  where?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Power_Down_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Power_Down_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Power_Down_Command_Order_By>>;
  where?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Power_Down_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Power_Down_Command_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Power_Down_Command_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Power_Down_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Radio_Rate_Change_CommandArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Radio_Rate_Change_Command_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Rate_Change_Command_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Radio_Rate_Change_Command_By_PkArgs = {
  rocket_command_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Radio_Rate_Change_Command_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Radio_Rate_Change_Command_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Radio_Rate_Change_Command_Bool_Exp>;
};


export type Subscription_RootRocket_Radio_StatusArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Status_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Status_Bool_Exp>;
};


export type Subscription_RootRocket_Radio_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Radio_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Radio_Status_Order_By>>;
  where?: InputMaybe<Rocket_Radio_Status_Bool_Exp>;
};


export type Subscription_RootRocket_Radio_Status_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Radio_Status_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Radio_Status_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_AirArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Air_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Air_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Air_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Air_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Air_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Air_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Air_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Air_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Air_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Pos_1Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Pos_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Pos_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Gps_Pos_1_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Gps_Pos_1_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Pos_2Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Pos_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Pos_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Pos_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Gps_Pos_2_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Gps_Pos_2_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Pos_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_VelArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Vel_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Gps_Vel_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Gps_Vel_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Gps_Vel_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Gps_Vel_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Gps_Vel_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Imu_1Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Imu_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Imu_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Imu_1_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Imu_1_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Imu_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Imu_2Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Imu_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Imu_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Imu_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Imu_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Imu_2_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Imu_2_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Imu_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_MessageArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Message_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Message_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Message_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Message_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Message_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Message_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Message_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Message_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Nav_1Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Nav_1_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_1_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_1_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Nav_1_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Nav_1_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Nav_1_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Nav_1_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Nav_2Args = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Nav_2_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Nav_2_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Nav_2_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Nav_2_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Nav_2_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Nav_2_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Nav_2_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_QuatArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Quat_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Quat_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Quat_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Quat_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Quat_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Quat_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Quat_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Utc_TimeArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Utc_Time_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_Sensor_Utc_Time_Order_By>>;
  where?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
};


export type Subscription_RootRocket_Sensor_Utc_Time_By_PkArgs = {
  rocket_sensor_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_Sensor_Utc_Time_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_Sensor_Utc_Time_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_Sensor_Utc_Time_Bool_Exp>;
};


export type Subscription_RootRocket_StateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_State_Order_By>>;
  where?: InputMaybe<Rocket_State_Bool_Exp>;
};


export type Subscription_RootRocket_State_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rocket_State_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rocket_State_Order_By>>;
  where?: InputMaybe<Rocket_State_Bool_Exp>;
};


export type Subscription_RootRocket_State_By_PkArgs = {
  rocket_message_id: Scalars['Int']['input'];
};


export type Subscription_RootRocket_State_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rocket_State_Stream_Cursor_Input>>;
  where?: InputMaybe<Rocket_State_Bool_Exp>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>;
  _gt?: InputMaybe<Scalars['timestamp']['input']>;
  _gte?: InputMaybe<Scalars['timestamp']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamp']['input']>;
  _lte?: InputMaybe<Scalars['timestamp']['input']>;
  _neq?: InputMaybe<Scalars['timestamp']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>;
};
