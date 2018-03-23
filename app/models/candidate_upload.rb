class CandidateUpload < ApplicationRecord
  belongs_to :candidate
  belongs_to :upload

  validates :candidate_id, presence: true
  validates :upload_id, presence: true
end
