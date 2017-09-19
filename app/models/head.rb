class Head < ApplicationRecord
  belongs_to :recruiter, :class_name => "User", foreign_key: :user_id
  has_many :candidates

  def to_s
    "#{self.first_name} #{self.last_name}"
  end
end
