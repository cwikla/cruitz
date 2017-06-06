class Rating < ApplicationRecord
  belongs_to :recruiter
  belongs_to :user
end
