class CandidatesController < ApplicationController
  def index
    render json: current_user.candidates.order(:id).all
  end
end
