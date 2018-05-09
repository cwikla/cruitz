class Head < ApplicationRecord
  belongs_to :recruiter, :class_name => "User", foreign_key: :user_id
  has_many :candidates
  has_many :jobs, through: :candidates

  has_many :experiences

  has_many :educations, -> { where(exp_type: Experience::EXP_TYPE_SCHOOL) }, class_name: "Experience"
  has_many :works, -> { where(exp_type: Experience::EXP_TYPE_COMPANY) }, class_name: "Experience"

  has_many :head_uploads
  has_many :uploads, through: :head_uploads

  has_many :head_locations
  has_many :locations, through: :head_locations

  cache_notify :user

  def self.after_cached_candidate(candidate)
    h = Head.new(:id => candidate.head_id)
  end

  def full_name
    return "#{first_name} #{last_name}"
  end

  def to_s
    "#{self.first_name} #{self.last_name}"
  end

end
