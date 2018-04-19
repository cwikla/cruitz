class Spam < ApplicationRecord
  belongs_to :user
  belongs_to :recruiter, class_name: "User"
  belongs_to :candidate
  belongs_to :message

  belongs_to :spam_reason

  validates :user_id, presence: true
  validates :recruiter_id, presence: true
  validates :spam_reason_id, presence: true

  def self.make(user, recruiter_id, reason_id)
    rec = User.is_recruiter.find(recruiter_id)

    reason = SpamReason.find(reason_id)

    val = Spam.create!(user: user, recruiter: rec, spam_reason: reason)
  end

end
