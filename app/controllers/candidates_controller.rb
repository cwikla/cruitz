class CandidatesController < ApplicationController
  def index
    render json: current_user.candidates.order(:created_at).all
  end

  def show
    cid = hid()
    render json: current_user.candidates.find(cid)
  end

  def thread
    cid = hid()
    Message.thread_for_candidate(cid)
  end
end
