import { gql } from "@apollo/client";
export const GET_MY_VERIFICATION_REQUEST_DATA = gql`
  query GetMyVerifcationRequestData($userAddress: String) {
    idVerifedAndIssueds(where: { userAddres: $userAddress }) {
      blockNumber
      blockTimestamp
      id
      requestId
      transactionHash
      userAddres
      userId
    }
  }
`;
export const REDEEM_USER_NFT = gql`
  query RedeemUserNFT($userAddress: String) {
    issueDigitalIdentities(where: { userAddres: $userAddress }) {
      userId
      userAddres
      transactionHash
      tokenId
      id
      blockTimestamp
      blockNumber
    }
  }
`;

export const DOCUMENT_PROCESS_WITH_SIGNATURE = gql`
  query DocumentProcessWithSignature($documentId: String) {
    documentProcessWithSignatures(where: { documentId: $documentId }) {
      transactionHash
      status
      id
      blockTimestamp
      documentId
      blockNumber
    }
  }
`;

export const CHECK_SIGNER_EXIST = gql`
  query CheckSignerExist($tokenId: String) {
    issueDigitalIdentities(where: { tokenId: $tokenId }) {
      userId
      blockNumber
    }
  }
`;

export const GET_OFFER_WITH_LIMITS = gql`
  query GetAllRecordOfUser(
    $tokenId: String!
    $collection: String!
    $limit: Int
  ) {
    offerCreatedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { tokenId: $tokenId, collection: $collection }
    ) {
      id
      isVoucher
      collection
      offerPrice
      tokenId
      ts
      status
      buyer
    }
  }
`;
export const GET_LISTED_ITEMS = gql`
  query GetListedItem($collectionAddress: String!, $tokenId: String!) {
    itemListedEntities(
      first: 100
      orderBy: id
      where: { collection: $collectionAddress, tokenId: $tokenId }
    ) {
      id
      minPrice
      currency
      expiry
      isFixedPrice
      tokenId
      ts
      status
      seller {
        id
      }
    }
  }
`;
export const GET_IS_NFT_LISTED__STATUS = gql`
  query GetListedItem($collectionAddress: String!, $tokenId: String!) {
    itemListedEntities(
      first: 1
      orderBy: id
      where: { collection: $collectionAddress, tokenId: $tokenId, status: true }
    ) {
      id
      minPrice
      currency
      expiry
      isFixedPrice
      tokenId
      ts
      status
      seller {
        id
      }
    }
  }
`;

export const GET_LISTED_ITEMS_STATUS = gql`
  query GetListedItemWithStatus(
    $status: Boolean!
    $limit: Int
    $userAddress: String
    $collection: String
  ) {
    itemListedEntities(
      first: $limit
      orderBy: id
      where: {
        status: $status
        collection: $collection
        seller_not: $userAddress
      }
    ) {
      id
      minPrice
      currency
      collection
      expiry
      isFixedPrice
      tokenId
      ts
      status
      seller {
        id
      }
    }
  }
`;

export const GET_ALL_LISTED_ITEMS_STATUS = gql`
  query GetAllListedItemWithStatus($status: Boolean!, $limit: Int) {
    itemListedEntities(first: $limit, orderBy: id, where: { status: $status }) {
      id
      minPrice
      currency
      collection
      expiry
      isFixedPrice
      tokenId
      ts
      status
      seller {
        id
      }
    }
  }
`;
export const GET_NFT_BOUGHT_ACTION = gql`
  query GetNFTBoughtAction(
    $tokeuserAddressnId: String!
    $collection: String!
    $status: Boolean!
    $limit: Int
  ) {
    itemBoughtEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { buyer: $userAddress, collection: $collection, status: $status }
    ) {
      id
      collection
      buyer
      status
      isVoucher
      tokenId
      ts
    }
  }
`;

export const GET_BOUGHT_NFT = gql`
  query GetBoughtNFT($userAddress: String, $limit: Int, $status: Boolean) {
    itemBoughtEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { buyer: $userAddress, status: $status }
    ) {
      id
      collection
      buyer
      status
      isVoucher
      tokenId
      ts
    }
  }
`;
export const GET_NFT_OFFER_ACCEPTED_ACTION = gql`
  query GetNFTOfferAcceptAction(
    $tokenId: String!
    $collection: String!
    $limit: Int
  ) {
    offerAcceptedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { tokenId: $tokenId, collection: $collection }
    ) {
      buyer
      collection
      id
      tokenId
      ts
    }
  }
`;
export const GET_NFT_OFFER_ACCEPTED_BY_ME = gql`
  query GetOfferAcceptedByMe($userAddress: String, $limit: Int) {
    offerAcceptedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { buyer: $userAddress }
    ) {
      buyer
      collection
      id
      tokenId
      ts
    }
  }
`;
export const GET_NFT_OFFER_REJECTED_ACTION = gql`
  query GetNFTOfferRejectAction(
    $tokenId: String!
    $collection: String!
    $limit: Int
  ) {
    offerRejectedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { tokenId: $tokenId, collection: $collection }
    ) {
      buyer
      collection
      id
      status
      tokenId
      ts
    }
  }
`;
export const GET_NFT_OFFER_REJECTED_BY_ME = gql`
  query GetOfferRejectByMe($userAddress: String, $limit: Int) {
    offerRejectedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { buyer: $userAddress }
    ) {
      buyer
      collection
      id
      status
      tokenId
      ts
    }
  }
`;
export const GET_NFT_CREATED_OFFER = gql`
  query GetNFTCreatedOffer(
    $tokenId: String!
    $collection: String!
    $limit: Int
  ) {
    offerCreatedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { tokenId: $tokenId, collection: $collection }
    ) {
      id
      isVoucher
      collection
      offerPrice
      tokenId
      ts
      status
      buyer
    }
  }
`;
export const GET_TOP_OFFERS = gql`
  query GetTopNFTCreatedOffer($limit: Int) {
    offerCreatedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { tokenId_not: "-1", status: true }
    ) {
      id
      isVoucher
      collection
      offerPrice
      tokenId
      ts
      status
      buyer
    }
  }
`;
export const GET_CREATED_OFFER_BY_ME = gql`
  query GetOfferCreatedByMe($userAddress: String, $limit: Int) {
    offerCreatedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { buyer: $userAddress, action: "offer" }
    ) {
      id
      isVoucher
      collection
      offerPrice
      tokenId
      ts
      status
      buyer
    }
  }
`;

export const GET_LISTED_NFT = gql`
  query GetListedNFT($tokenId: String!, $collection: String!, $limit: Int) {
    itemListedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { tokenId: $tokenId, collection: $collection }
    ) {
      id
      ts
      collection
      tokenId
      currency
      expiry
      isFixedPrice
      minPrice
      seller
      status
    }
  }
`;
export const GET_LISTED_BY_ME = gql`
  query GetListedNFTByMe($userAddress: String, $limit: Int, $status: Boolean) {
    itemListedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: {
        seller: $userAddress
        status: $status
        tokenId_not: "-1"
        action: "listed"
      }
    ) {
      id
      ts
      collection
      tokenId
      currency
      expiry
      isFixedPrice
      minPrice
      seller
      status
    }
  }
`;
export const GET_UN_LISTED_NFT = gql`
  query GetunListedNFT($tokenId: String!, $collection: String!, $limit: Int) {
    itemListedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { tokenId: $tokenId, collection: $collection, status: false }
    ) {
      id
      ts
      collection
      tokenId
      currency
      expiry
      isFixedPrice
      minPrice
      seller
      status
    }
  }
`;
export const GET_UN_LISTED_BY_ME = gql`
  query GetunListedNFTByMe($userAddress: String, $limit: Int) {
    itemListedEntities(
      first: $limit
      orderBy: ts
      orderDirection: desc
      where: { seller: $userAddress, status: false }
    ) {
      id
      ts
      collection
      tokenId
      currency
      expiry
      isFixedPrice
      minPrice
      seller
      status
    }
  }
`;
export const GET_ALL_LISTED_CURRENCY = gql`
  query GetAllListedCurrenct($status: Boolean!) {
    currencyWhitelistedEntities(
      orderBy: ts
      orderDirection: desc
      where: { addOrRemove: $status }
    ) {
      addOrRemove
      id
      ts
    }
  }
`;
