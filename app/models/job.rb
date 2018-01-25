class Job < ApplicationRecord
  belongs_to :user

  has_many :candidates
  has_many :heads, through: :candidates
  has_many :messages

  has_many :job_categories
  has_many :categories, through: :job_categories

  has_many :job_locations
  has_many :locations, through: :job_locations

  JOB_FULL_TIME = 0
  JOB_PART_TIME = 1
  JOB_CONTRACTOR = 2

  validates :title, presence: true
  validates :location, presence: true
  validates :description, presence: true
  validates :time_commit, presence: true, inclusion: [JOB_FULL_TIME, JOB_PART_TIME, JOB_CONTRACTOR]

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

  def self.open
    self.where.not(closed_at: nil)
  end
end
