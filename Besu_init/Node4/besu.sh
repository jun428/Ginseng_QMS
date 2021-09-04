#!/bin/bash

besu --data-path=data --genesis-file=../genesis.json --bootnodes= enode://be0e2c1b745029173fb13c88fd39df63ad750e7a57da0f87e8cdbfeabf1a057e63c581c320570a0920cf95872bb4a77e39d704aca4ce077624169e5c68c8ba2a@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT,WEB3 --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548 --min-gas-price=0
