class CandidateState < ApplicationRecord
  belongs_to :candidate
  belongs_to :user
  belongs_to :message

  validates :candidate, presence: true
  validates :user, presence: true

  private

end
