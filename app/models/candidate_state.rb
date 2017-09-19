class CandidateState < ApplicationRecord
  belongs_to :candidate
  belongs_to :user
  belongs_to :recruiter, :class_name => "User"
  belongs_to :message
end
