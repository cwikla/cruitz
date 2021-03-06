class PositionsController < ApplicationController
  LIMIT = 50

  def index
    all = Job.order("-id") #.limit(1)
    render json: all, each_serializer: JobSmallSerializer, company: true #, submitted_candidates: true
  end

  def search
    #puts "PARAMS"
    #puts params

    spar = search_params
    #puts "PARAMS"
    #puts spar

    all = Job.full_search(spar)
    #all = []

    render json: all, company: true
  end

  def create
    cp = create_params

    job = Job.find(cp[:job])
    my_head = current_user.heads.find(cp[:head])

    @candidate = Candidate.new(job: job, head: my_head)

    if @candidate.save
      return render json: @candidate, current_user: current_user
    else
      return render_create_error json: @candidate
    end
  end

  def candidates
    pid = position_params
    @candies = current_user.submitted_candidates.where(job_id: pid)
    render json: @candies, current_user: current_user
  end

  def show
    pid = position_params
    render json: Job.find_safe(pid), company: true, submitted_candidates: true
  end

  private

  def create_params
    params.require(:position).require(:job, :head)
  end

  def position_params
    params.require(:id)
  end

  def search_params
    params.require(:search).permit(:key_words, :age, categories: [], locations: [], skills: [], companies: [])
  end
end
