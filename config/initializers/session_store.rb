# Be sure to restart your server when you modify this file.

Rails.application.config.session_store :cookie_store, key: '_cruitz_session', :secret => Cruitz::Application.config.secret_token
