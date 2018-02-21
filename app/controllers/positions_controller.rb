class PositionsController < ApplicationController
  def index
    all = Job.order("-id").limit(10)
    render json: all, company: true, submitted_candidates: true
  end

  def search
    puts "PARAMS"
    puts params

    spar = search_params
    puts "PARAMS"
    puts spar

    all = Job.full_search(spar).limit(10)
    #all = []

    render json: all, company: true
  end

  def candidates
    pid = position_params
    @candies = current_user.submitted_candidates.where(job_id: pid)
    render json: @candies
  end

  def show
    pid = position_params
    render json: Job.find_safe(pid), root: :position, company: true
  end

  def position_params
    params.require(:id)
  end

  def search_params
    params.require(:search).permit(:key_words, :age, categories: [], locations: [], skills: [], companies: [])
  end
end
