class SpamReasonsController < ApplicationController
  def index
    render json: SpamReason.all
  end
end
