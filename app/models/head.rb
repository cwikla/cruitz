class Head < ApplicationRecord
  belongs_to :recruiter, :class_name => "User"
end
