class Head < ApplicationRecord
  belongs_to :user, :class_name => "User"

  def to_s
    "#{self.first_name} #{self.last_name}"
  end
end
