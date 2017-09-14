class Setting < ApplicationRecord
  belongs_to :user

  before_create :set_defaults

  private

  def set_defaults
    self.use_ignore_recruiters =  true
    self.minimum_recruiter_score = 80
    self.use_ignore_agencies =  true
    self.minimum_agency_score = 80
    self.use_reject_candidates = true
    self.reject_candidate_days =  7
    self.use_auto_spam =  true
    self.use_ban_recruiter =  true
    self.ban_recruiter_days = 7
    self.use_ban_agency =  true
    self.ban_agency_days = 90 
    self.use_recruiter_limit = true
    self.recruiter_limit = 4
    self.use_agency_limit = true
    self.agency_limit = 8
    self.agency_limit = 15
  end
end
