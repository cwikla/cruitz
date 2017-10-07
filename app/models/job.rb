class Job < ApplicationRecord
  cached_belongs_to :user

  cached_has_many :candidates
  cached_has_many :heads, :through => :candidates
  cached_has_many :messages

  JOB_FULL_TIME = 0
  JOB_PART_TIME = 1
  JOB_CONTRACTOR = 2

  validates :title, presence: true
  validates :location, presence: true
  validates :description, presence: true
  validates :time_commit, presence: true, :inclusion => [JOB_FULL_TIME, JOB_PART_TIME, JOB_CONTRACTOR]

  def self.after_cached_candidate(candidate)
    j = Job.new(:id => candidate.job_id)
    j.candidates_uncache
    j.heads_uncache
  end

  def self.after_cached_head(head)
    j = Job.new(:id => head.candidate.job_id)
    j.heads_uncache
  end

  def self.after_cached_message(message)
    j = Job.new(:id => message.job_id)
    j.messages_uncache
  end

  def to_s
    "#{id}:#{self.title}"
  end

  def self.open
    self.where.not(closed_at: nil)
  end
end
