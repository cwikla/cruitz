class JobsController < ApplicationController
  def index
    render json: {jobs: current_user.jobs}
  end

  def new
    @job = Job.new
  end

  def create
   request.headers.each do |k,v|
     puts "HEADER: #{k} => #{v}"
   end

    @job = current_user.jobs.build(job_params)
    if @job.save
      resp = @job
    else
      return render_create_error json: @job
    end
  end

  def update
    @job = current_user.jobs.where(:id => params[:id]).first
    @job.update_attributes(job_params)
    
  render json: @job
  end

  def lsearch
    result = GeoName.search(params[:term]).map(&:name)
    puts "***** RESULT #{result}"
    render json: result
  end

  private

  def job_params
    params.require(:job).permit(:title, :description, :location, :time_commit)
  end
end
