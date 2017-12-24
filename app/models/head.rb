class Head < ApplicationRecord
  cached_belongs_to :recruiter, :class_name => "User", foreign_key: :user_id
  cached_has_many :applications, :class_name => "Candidate"

  cache_notify :user

  def self.after_cached_candidate(candidate)
    h = Head.new(:id => candidate.head_id)
    h.applications_uncache
  end

  def to_s
    "#{self.first_name} #{self.last_name}"
  end
end
