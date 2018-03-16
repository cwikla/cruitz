class JobsController < ApplicationController
  def index
    render json: current_user.jobs.includes(:user)
  end

  def open
    all = Job.order("-id").limit(50)
    render json: all, company: true, submitted_candidates: true
  end

  def search
    puts "PARAMS"
    puts params

    spar = search_params
    puts "PARAMS"
    puts spar

    all = Job.full_search(spar).limit(50)
    #all = []

    render json: all, company: true
  end

  def position
    pid = position_params
    render json: Job.find_safe(pid), root: :position, company: true
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

    skill_names = jparms.delete(:skills)
    cat_id = jparms.delete(:category)
    loc_ids = jparms.delete(:locations)

    @job = current_user.jobs.build(jparms)
    begin
      Job.transaction(:requires_new => true) do
        @job.save!

        do_parts(@job)

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

    jparms = job_params

    skill_names = jparms.delete(:skills)
    cat_id = jparms.delete(:category)
    loc_ids = jparms.delete(:locations)

    begin
      Job.transaction(:requires_new => true) do
        @job.update!(jparms)

        do_parts(@job)

        @job.save!
      end

      return render json: @job

    rescue => e

      puts "E: #{e.inspect}"
      puts "ERROR: #{@job.errors.inspect}"
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

  def do_parts(job)
    jparms = job_params

    skill_names = jparms.delete(:skills)
    cat_id = jparms.delete(:category)
    loc_ids = jparms.delete(:locations)

    # NEED TO DEDUPE

    skills = []
    skills = Skill.get_skill(*skill_names) if !skill_names.blank?

    puts "SKILLS"
    puts skills

    job.skills = skills

    puts "CAT"
    puts "CAT IDS #{cat_id.inspect}"

    cat = nil
    cat = Category.find(cat_id)
    job.categories = [ cat ] if cat

    puts "LOC_IDS"
    puts loc_ids

    locations = []
    locations = GeoName.find(loc_ids) if loc_ids

    puts "LOCATIONS"
    puts locations.inspect

    job.locations = locations
  end

  def position_params
    params.require(:id)
  end

  def job_params
    params.require(:job).permit(:title, :description, :time_commit, :category, locations: [], skills: [])
  end

  def search_params
    params.require(:search).permit(:key_words, :age, categories: [], locations: [], skills: [], companies: [])
  end
end
