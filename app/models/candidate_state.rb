class CandidateState < ApplicationRecord
  belongs_to :candidate
  belongs_to :user
  belongs_to :recruiter, :class_name => "User"
  belongs_to :message
  belongs_to :job

  before_save :pre_check

  validates :candidate, presence: true
  validates :user, presence: true
  validates :recruiter, presence: true
  validates :job, presence: true

  private

  def pre_check
    self.state ||= Candidate::SUBMITTED_STATE
    self.job_id = self.candidate.job_id if self.job_id.nil?
  end
end
