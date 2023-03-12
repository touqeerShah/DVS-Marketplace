// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Test1 {
    struct Party {
        uint256 tokenId;
        uint256 status;
    }

    constructor() {}

    function getAddress(Party calldata party) public pure returns (Party calldata) {
        return party;
    }

    function getHash(uint256 a, uint256 b) public pure returns (bytes32 hash) {
        hash = keccak256(
            abi.encodePacked(keccak256("createUserId(uint256 tokenId,uint256 status)"), b, a)
        );
    }
}
