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

    jparms = job_params.dup
    skill_names = jparms.delete(:skill) # FIXME

    puts "SKILL_NAMES"
    puts skill_names

    skills = Skill.get_skill(skill_names)

    puts "SKILLS"
    puts skills.inspect

    puts "PARAMS"
    puts "#{jparms.inspect}"

    @job = current_user.jobs.build(jparms)
    if true || @job.save
      return render json: @job
    else
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
