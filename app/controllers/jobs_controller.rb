class JobsController < ApplicationController
  def index
    render json: current_user.jobs.order(:created_at).all
  end

  def candidate_counts
    render json: current_user.candidate_counts
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
      return render json: @job
    else
      puts "ERROR: #{@job.errors.inspect}"
      return render_create_error json: @job
    end
  end

  def update
    jid = hid()
    @job = current_user.jobs.find(jid)
    if @job.update(job_params)
      return render json: @job
    else
      return render_create_error json: @job
    end
  end

  def show
    jid = hid()
    @job = current_user.jobs.find(jid)

    result = {}
    result[:job] = JobSerializer.new(@job)
    result[:candidates] = ActiveModel::Serializer::CollectionSerializer.new(@job.candidates) if params[:cand]

    render json: result
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
