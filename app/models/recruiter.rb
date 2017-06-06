class Recruiter < ApplicationRecord
  belongs_to :agency
  belongs_to :user

  has_many :heads
end
