class CandidateState < ApplicationRecord
  cached_belongs_to :candidate
  cached_belongs_to :user
  cached_belongs_to :recruiter, :class_name => "User"
  cached_belongs_to :message
end
