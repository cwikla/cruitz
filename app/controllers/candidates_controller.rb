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

  def update
    puts "PARAMS #{params.inspect}"
    cid = hid()
    @candidate = current_user.candidates.find(cid)
    if @candidate.update(candidates_params)
      return render json: @candidate
    else
      return render_create_error json: @candidate
    end
  end

  private

  def candidates_params
    params.require(:candidate).permit(:state)
  end


end
