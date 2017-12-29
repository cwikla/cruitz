class JobCategory < ApplicationRecord
  belongs_to :job
  belongs_to :category
end
