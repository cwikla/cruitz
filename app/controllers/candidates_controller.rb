class CandidatesController < ApplicationController
  def index
    render json: current_user.candidates.order(:id).all
  end

  def show
    render json: current_user.candidates.find(params[:id])
  end

  def thread
    Message.thread_for_candidate(params[:id])
  end
end
