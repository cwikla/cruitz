class JobsController < ApplicationController
  LIMIT = 100000 # Rails.env.development?  ? 25 : 100

  def index
    render json: current_user.jobs.order("-id").includes(:skills, :locations, :job_locations, :company, :job_skills) #.limit(LIMIT)
  end

  def open
    all = Job.order("-id").includes(:company, :locations, :job_locations, :skills, :job_skills).limit(LIMIT)
    render json: all, company: true #, submitted_candidates: true
  end

  def search
    puts "PARAMS"
    puts params

    spar = search_params
    puts "PARAMS"
    puts spar

    all = Job.full_search(spar).includes(:company, :locations, :job_locations, :skills, :job_skills).limit(LIMIT)
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
    file_ids = jparms.delete(:uploads)

    @job = current_user.jobs.build(jparms)
    begin
      Job.transaction(requires_new: true) do
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
    file_ids = jparms.delete(:uploads)

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
    @job = Job.find(jid) # current_user.jobs.includes(:user).find(jid) # FIXME

    getCands = params[:candidates] # && params[:candidates].downcase == 'candidates'

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
    file_ids = jparms.delete(:uploads)

    # NEED TO DEDUPE

    # THIS WAS DONE BECAUSE I KEPT GETTING CLASS ASSOCIATIONMISMATCH errors

    skills = []
    skills = Skill.get_skill(*skill_names) if !skill_names.blank?

    js = []
    skills.each do |skill|
      js << JobSkill.find_or_create_unique(job_id: job.id, skill: skill)
    end

    job.job_skills = js

    jcs = []
    if cat_id
      jcs << JobCategory.find_or_create_unique(job_id: job.id, category_id: cat_id)
    end

    job.job_categories = jcs

    jlocs = []
    loc_ids.each do |l|
      jlocs << JobLocation.find_or_create_unique(job_id: job.id, location_id: l)
    end

    job.job_locations = jlocs

    # FIXME PERMISSIONS
    job_uploads = []
    file_ids.each do |fid|
      upload = Upload.find(fid) # need to get the real id, not uuid
      job_uploads << JobUpload.find_or_create_unique(job_id: job.id, upload_id: upload.id) if upload
    end

    job.job_uploads = job_uploads
  end

  def position_params
    params.require(:id)
  end

  def job_params
    jp = params.require(:job).permit(:title, :description, :time_commit, :category, :salary, :salary_doe, locations: [], skills: [], uploads: [])
    if !jp[:salary].blank?
      val = jp[:salary]
      val = val.sub(",", "")
      val = val.split(".")[0]
      jp[:salary] = val
    end
    jp
  end

  def search_params
    params.require(:search).permit(:key_words, :age, categories: [], locations: [], skills: [], companies: [])
  end
end
