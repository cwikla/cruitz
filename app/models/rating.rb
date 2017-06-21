class Rating < ApplicationRecord
  belongs_to :recruiter, class_name: "User"
  belongs_to :user
end
