class Candidate < ApplicationRecord
  belongs_to :job
  belongs_to :head
  has_one :recruiter, through: :head, class_name: 'User'

  scope :isnew, -> { where(accepted_at: nil).where(rejected_at: nil) }
  scope :accepted, -> {  where.not(accepted_at: nil).where(rejected_at: nil) }
  scope :rejected, -> {  where.not(rejected_at: nil) }
  scope :live, -> { where(rejected_at: nil) }

  def to_s
    "#{job.id} => #{job.title} => #{head}"
  end
end
