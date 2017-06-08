class Job < ApplicationRecord
  belongs_to :employer

  def self.open
    self.where.not(closed_at: nil)
  end
end
