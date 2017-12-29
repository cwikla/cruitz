class Head < ApplicationRecord
  belongs_to :recruiter, :class_name => "User", foreign_key: :user_id
  has_many :applications, :class_name => "Candidate"

  cache_notify :user

  def self.after_cached_candidate(candidate)
    h = Head.new(:id => candidate.head_id)
  end

  def to_s
    "#{self.first_name} #{self.last_name}"
  end
end
