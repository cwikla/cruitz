class CandidatesController < ApplicationController
  def index
    render json: current_user.candidates
  end

  def show
    cid = hid()
    render json: current_user.candidates.find(cid)
  end

  def thread
    cid = hid()
    Message.thread_for_candidate(cid)
  end

  def create
    cp = create_params

    head = current_user.heads.find(cp[:head])
    job = Job.find(cp[:job])

    current_user.heads.find(hid)

    @candidate = job.candidates.create(head: head, job: job)

    return render json @candidate
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

  def create_params
    params.require(:job, :head)
  end

  def candidates_params
    params.require(:candidate).permit(:state)
  end


end
