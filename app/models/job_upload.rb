class JobUpload < ApplicationRecord
  belongs_to :job
  belongs_to :upload

  validates :job_id, presence: true
  validates :upload_id, presence: true
end
