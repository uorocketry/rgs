// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "hydra_provider/proto/data_feed.proto" (package "data_feed", syntax proto3)
// tslint:disable
import { RandomDataFeed } from "./data_feed";
import type { RandomDataFeedStatus } from "./data_feed";
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { SerialDataFeed } from "./data_feed";
import type { SerialDataFeedStatus } from "./data_feed";
import type { SerialDataFeedConfig } from "./data_feed";
import type { ListAvailablePortsResponse } from "./data_feed";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Empty } from "./data_feed";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service data_feed.SerialDataFeed
 */
export interface ISerialDataFeedClient {
    /**
     * @generated from protobuf rpc: start(data_feed.Empty) returns (data_feed.Empty);
     */
    start(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
    /**
     * @generated from protobuf rpc: stop(data_feed.Empty) returns (data_feed.Empty);
     */
    stop(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
    /**
     * @generated from protobuf rpc: list_available_ports(data_feed.Empty) returns (data_feed.ListAvailablePortsResponse);
     */
    listAvailablePorts(input: Empty, options?: RpcOptions): UnaryCall<Empty, ListAvailablePortsResponse>;
    /**
     * @generated from protobuf rpc: configure(data_feed.SerialDataFeedConfig) returns (data_feed.Empty);
     */
    configure(input: SerialDataFeedConfig, options?: RpcOptions): UnaryCall<SerialDataFeedConfig, Empty>;
    /**
     * @generated from protobuf rpc: get_status(data_feed.Empty) returns (data_feed.SerialDataFeedStatus);
     */
    getStatus(input: Empty, options?: RpcOptions): UnaryCall<Empty, SerialDataFeedStatus>;
}
/**
 * @generated from protobuf service data_feed.SerialDataFeed
 */
export class SerialDataFeedClient implements ISerialDataFeedClient, ServiceInfo {
    typeName = SerialDataFeed.typeName;
    methods = SerialDataFeed.methods;
    options = SerialDataFeed.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: start(data_feed.Empty) returns (data_feed.Empty);
     */
    start(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: stop(data_feed.Empty) returns (data_feed.Empty);
     */
    stop(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: list_available_ports(data_feed.Empty) returns (data_feed.ListAvailablePortsResponse);
     */
    listAvailablePorts(input: Empty, options?: RpcOptions): UnaryCall<Empty, ListAvailablePortsResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, ListAvailablePortsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: configure(data_feed.SerialDataFeedConfig) returns (data_feed.Empty);
     */
    configure(input: SerialDataFeedConfig, options?: RpcOptions): UnaryCall<SerialDataFeedConfig, Empty> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<SerialDataFeedConfig, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: get_status(data_feed.Empty) returns (data_feed.SerialDataFeedStatus);
     */
    getStatus(input: Empty, options?: RpcOptions): UnaryCall<Empty, SerialDataFeedStatus> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, SerialDataFeedStatus>("unary", this._transport, method, opt, input);
    }
}
/**
 * @generated from protobuf service data_feed.RandomDataFeed
 */
export interface IRandomDataFeedClient {
    /**
     * @generated from protobuf rpc: start(data_feed.Empty) returns (data_feed.Empty);
     */
    start(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
    /**
     * @generated from protobuf rpc: stop(data_feed.Empty) returns (data_feed.Empty);
     */
    stop(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
    /**
     * @generated from protobuf rpc: get_status(data_feed.Empty) returns (data_feed.RandomDataFeedStatus);
     */
    getStatus(input: Empty, options?: RpcOptions): UnaryCall<Empty, RandomDataFeedStatus>;
}
/**
 * @generated from protobuf service data_feed.RandomDataFeed
 */
export class RandomDataFeedClient implements IRandomDataFeedClient, ServiceInfo {
    typeName = RandomDataFeed.typeName;
    methods = RandomDataFeed.methods;
    options = RandomDataFeed.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: start(data_feed.Empty) returns (data_feed.Empty);
     */
    start(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: stop(data_feed.Empty) returns (data_feed.Empty);
     */
    stop(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: get_status(data_feed.Empty) returns (data_feed.RandomDataFeedStatus);
     */
    getStatus(input: Empty, options?: RpcOptions): UnaryCall<Empty, RandomDataFeedStatus> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, RandomDataFeedStatus>("unary", this._transport, method, opt, input);
    }
}
