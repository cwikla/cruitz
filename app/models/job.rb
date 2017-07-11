class Job < ApplicationRecord
  include Pyr::Base::UuidHelp

  belongs_to :user
  has_many :candidates
  has_many :heads, :through => :candidates

  JOB_FULL_TIME = 0
  JOB_PART_TIME = 1
  JOB_CONTRACTOR = 2

  validates :title, presence: true
  validates :location, presence: true
  validates :description, presence: true
  validates :time_commit, presence: true, :inclusion => [JOB_FULL_TIME, JOB_PART_TIME, JOB_CONTRACTOR]

  include Pyr::Base::SimpleCache
  acts_as_simple_cache

  def self.open
    self.where.not(closed_at: nil)
  end
end
