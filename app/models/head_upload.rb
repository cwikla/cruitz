class HeadUpload < ApplicationRecord
  belongs_to :head
  belongs_to :upload

  validates :head_id, presence: true
  validates :upload_id, presence: true
end
