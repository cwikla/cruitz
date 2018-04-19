class Spam < ApplicationRecord
  belongs_to :user
  belongs_to :recruiter, class_name: "User"
  belongs_to :candidate
  belongs_to :message

  belongs_to :reason, class_name: "SpamReason"

  validates :user_id, presence: true
  validates :recruiter_id, presence: true
end
