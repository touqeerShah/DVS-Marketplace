CREATE TABLE IF NOT EXISTS PharmaTraceEvent (
  transactionId varchar NOT NULL,
  endorsements varchar NOT NULL,
  chaincodeName varchar NOT NULL,
  functionName varchar NOT NULL,
  args varchar NOT NULL,
  recordId varchar NOT NULL,
  ts varchar NOT NULL,
  eventResponse varchar NOT NULL,
  PRIMARY KEY (transactionId)
);

