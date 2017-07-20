class Candidate < ApplicationRecord
  belongs_to :job
  belongs_to :head

  def to_s
    "#{job.id} => #{job.title} => #{head}"
  end
end
