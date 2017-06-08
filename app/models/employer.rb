class Employer < ApplicationRecord
  belongs_to :company
  belongs_to :user

  has_many :jobs
end
