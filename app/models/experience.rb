class Experience < ApplicationRecord
  belongs_to :head

  EXP_TYPE_COMPANY = 0
  EXP_TYPE_SCHOOL = 1

  EXP_TYPES = [
    EXP_TYPE_COMPANY,
    EXP_TYPE_SCHOOL
  ]

  validates :head_id, presence: true
  validates :place, presence: true
  validates :title, presence: true
  validates :exp_type, presence: true, inclusion: {in: EXP_TYPES}
  validates :year_start, numericality: { only_integer: true }, allow_nil: false
  validates :year_end, numericality: { only_integer: true }, allow_nil: true

end
