
CREATE TABLE IF NOT EXISTS transaction_queue_logs (
  uuid varchar NOT NULL,
  routingKey varchar NOT NULL,
  userKey varchar NOT NULL,
  apiName varchar NOT NULL,
  queue_data varchar NOT NULL,
  queue_status varchar NOT NULL,
  error varchar NOT NULL

);

