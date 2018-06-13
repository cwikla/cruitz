class PusherController < ApplicationController

  skip_before_action :verify_authenticity_token # FIXME?
  before_action :setup_pusher

  def auth
    if current_user
      response = @pusher_client.authenticate(params[:channel_name], params[:socket_id])
      render json: response
    else
      render text: 'Forbidden', status: '403'
    end
  end

  def setup_pusher
    @pusher_client = Pusher::Client.new(
      app_id: ::PUSHER_APP_ID,
      key: ::PUSHER_KEY,
      secret: ::PUSHER_SECRET,
      cluster: ::PUSHER_CLUSTER,
      logger: ::PUSHER_LOGGER,
      encrypted: ::PUSHER_ENCRYPTED
    )
  end

end
