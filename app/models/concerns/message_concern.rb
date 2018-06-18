module MessageConcern
  extend ActiveSupport::Concern

  included do
    after_create :create_notify
  end

  module ClassMethods
  end

  def create_notify
    MessageNotifyJob.notify(self)
  end

end
