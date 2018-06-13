require 'pusher'

development = {
  app_id: "541804",
  key: "c9b6d0b4647c88393e62",
  secret: "68afd2bfdfcf91ab1a35",
  cluster: "us2",
  encrypted: false
}

staging = {
  app_id: '541805',
  key: '95b89cfee87822b4ecbe',
  secret: '5f68b0f6d2d499123a21',
  cluster: 'us2',
  encrypted: true
}

production = {
  app_id: "541806",
  key: "e9312cc8007eaaa1a9c1",
  secret: "b9202f74d06dca616f58",
  cluster: "us2"
}

pusher_args = {
  development: development,
  staging: staging,
  production: production,
}

PUSHER_APP_ID = pusher_args[Rails.env.to_sym][:app_id]
PUSHER_KEY = pusher_args[Rails.env.to_sym][:key]
PUSHER_SECRET = pusher_args[Rails.env.to_sym][:secret]
PUSHER_CLUSTER = pusher_args[Rails.env.to_sym][:cluster]
PUSHER_LOGGER = pusher_args[Rails.env.to_sym][:logger]
PUSHER_ENCRYPTED = pusher_args[Rails.env.to_sym][:encrypted]

Pusher.app_id = ::PUSHER_APP_ID
Pusher.key = ::PUSHER_KEY
Pusher.secret = ::PUSHER_SECRET
Pusher.cluster = ::PUSHER_CLUSTER
Pusher.logger = ::PUSHER_LOGGER
Pusher.encrypted = ::PUSHER_ENCRYPTED
