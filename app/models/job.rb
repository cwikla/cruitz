class Job < ApplicationRecord
  belongs_to :user

  has_many :candidates
  has_many :heads, through: :candidates
  has_many :messages

  has_many :job_skills
  has_many :skills, through: :job_skills

  has_many :job_categories
  has_many :categories, through: :job_categories

  has_many :job_locations
  has_many :locations, through: :job_locations

  has_one :company, through: :user

  has_many :job_uploads
  has_many :uploads, through: :job_uploads


  JOB_FULL_TIME = 0
  JOB_PART_TIME = 1
  JOB_CONTRACTOR = 2

  ONE_MINUTE = 60
  ONE_HOUR = ONE_MINUTE * 60
  ONE_DAY = ONE_HOUR * 24
  ONE_WEEK = ONE_DAY * 7
  ONE_MONTH = ONE_WEEK * 4

  POSTING_RANGES = {
    0 => ONE_DAY * 2,
    1 => ONE_WEEK,
    2 => ONE_WEEK * 2,
    3 => ONE_WEEK * 3,
    4 => ONE_MONTH,
    5 => ONE_MONTH * 2,
    6 => ONE_MONTH * 3,
    7 => ONE_MONTH * 4,
    8 => ONE_MONTH * 5,
    9 => ONE_MONTH * 6,
    10 => ONE_MONTH * 10000
  }

  validates :title, presence: true
  validates :description, presence: true
  validates :time_commit, presence: true, inclusion: [JOB_FULL_TIME, JOB_PART_TIME, JOB_CONTRACTOR]

  validates :salary, :numericality => {:only_integer => true}, allow_blank: true

  pg_search_scope :search, against: [:title, :description] #, using: :trigram

  def self.after_cached_candidate(candidate)
    j = Job.new(:id => candidate.job_id)
  end

  def self.after_cached_head(head)
    j = Job.new(:id => head.candidate.job_id)
  end

  def self.after_cached_message(message)
    j = Job.new(:id => message.job_id)
  end

  def to_s
    "#{id}:#{self.title}"
  end

  def self.where_range(age)
    age = age.to_i
    age = 0 if age < 0
    age = POSTING_RANGES.length if age > POSTING_RANGES.length
    val = POSTING_RANGES[age]

    where("jobs.created_at >= ?", Time.zone.now - val)
  end

  def self.is_open
    self.where.not(closed_at: nil)
  end

  def self.full_search(params)
    q = self
    kw = params[:key_words]
    q = q.search(kw.strip) if !kw.blank?

    age = params[:age]
    if !age.blank?
      q = q.where_range(age)
    end

    categories = [*params[:categories]]
    if !categories.blank?
      q = q.joins(:categories).merge(Category.where(id: categories).or(Category.where(parent_id: categories)))
    end

    locations = [*params[:locations]]
    if !locations.blank?
      q = q.joins(:locations).merge(GeoName.where(id: locations).or(GeoName.where(primary_id: locations)))
    end

    companies = [*params[:companies]]
    if !companies.blank?
      q = q.joins(:company).merge(Company.where(id: companies))
    end

    skills = [*params[:skills]]
    if !skills.blank?
      q = q.joins(:skills).merge(Skill.where(id: skills))
    end

    return q.order("-jobs.id")
  end
end
