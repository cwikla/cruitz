class JobsController < ApplicationController
  def index
    render json: current_user.jobs.includes(:user)
  end

  def candidate_counts
    render json: current_user.candidate_counts
  end

  def new
    @job = Job.new
  end

  def create
    #request.headers.each do |k,v|
      #puts "HEADER: #{k} => #{v}"
    #end

    jparms = job_params

    skill_names = jparms.delete(:skill)
    cats = jparms.delete(:category)

    @job = current_user.jobs.build(jparms)
    begin
      Job.transaction(:requires_new => true) do
        @job.save!
    
        skills = []
        skills = Skill.get_skill(*skill_names) if !skill_names.blank?
    
        skills.each do |sk|
          @job.skills << sk
        end
    
        cats = []
        cats = Category.get_category(*cats) if !cats.blank?
    
        cats.each do |ct|
          @jobs.categories << ct
        end
  
        res = @job.save!
      end

      return render json: @job

    rescue => e
      puts "E: #{e.inspect}"
      puts "ERROR: #{@job.errors.inspect}"
      return render_create_error json: @job
    end
  end

  def update
    jid = hid()
    @job = current_user.jobs.includes(:user).find(jid)
    if @job.update(job_params)
      return render json: @job
    else
      return render_create_error json: @job
    end
  end

  def show
    jid = hid()
    @job = current_user.jobs.includes(:user).find(jid)

    getCands = params[:candidates] && params[:candidates].downcase == 'candidates'

    render json: @job, candidates: getCands
  end

  def lsearch_unused
    results = GeoName.search(params[:q]).map{ |x| [x.name, x.admin_code_1 || x.admin_name_1].join(", ")}.uniq
    puts "***** RESULT #{results}"
    render json: { results: results }
  end

  private

  def job_params
    params.require(:job).permit(:title, :description, :time_commit, :category, location: [], skill: [])
  end
end
