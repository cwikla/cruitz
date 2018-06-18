module CandidateConcern
  extend ActiveSupport::Concern

  included do
    #after_create :create_notify
    #after_save :state_notify
  end

  module ClassMethods
  end

  def create_notify
    CandidateNotifyJob.notify(self)
  end

  def state_notify
    CandidateNotifyJob.notify(self) if self.saved_change_to_state?
  end

end
