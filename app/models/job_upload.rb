class JobUpload < ApplicationRecord
  belongs_to :job
  belongs_to :upload, foreign_key: :pyr_upload_id

  validates :job_id, presence: true
  validates :pyr_upload_id, presence: true
end
