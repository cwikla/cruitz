class CandidatesController < ApplicationController

  def index
    render json: current_user.candidates.order("-candidates.id").limit(10)
  end

  def jobs
    render Job.where(id: u.candidates.select(:job_id).map(&:job_id).uniq), each_serializer: JobSerializer
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
    puts "CP"
    puts cp

    my_head = current_user.heads.find(cp[:head])
    job = Job.find(cp[:job])
    commission = cp[:commission]
    body = cp[:message] || cp[:body]

    @candidate = Candidate.submit(my_head, job, commission, body)

    return render json: @candidate
  end

  def destroy
    cid = params.require(:id)
    
    @candidate = current_user.submitted_candidates.find(cid)
    @candidate.cancel

    render body: nil, status: :no_content
  end

  def update
    cid = hid()
    @candidate = current_user.candidates.find(cid)
    if @candidate.setState(candidates_params[:state], current_user)
      return render json: @candidate
    else
      return render_create_error json: @candidate
    end
  end

  private

  def create_params
    puts params

    params.require(:candidate).permit(:job, :head, :message, :commission, :views)
  end

  def candidates_params
    params.require(:candidate).permit(:state)
  end


end
