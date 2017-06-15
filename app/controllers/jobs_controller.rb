class JobsController < ApplicationController

  def new
    @job = Job.new
  end

  def create
    current_user.jobs.create(job_params)
  end

  def lsearch
    result = GeoName.search(params[:term]).map(&:name)
    puts "***** RESULT #{result}"
    render json: result
  end

  private

  def job_params
    params(:job).permit(:title, :description)
  end
end
