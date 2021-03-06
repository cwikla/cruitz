class Experience < ApplicationRecord
  belongs_to :head

  EXP_TYPE_COMPANY = 0
  EXP_TYPE_SCHOOL = 1

  EXP_TYPES = [
    EXP_TYPE_COMPANY,
    EXP_TYPE_SCHOOL
  ]

  validates :head, presence: true
  validates :place, presence: true
  validates :title, presence: true
  validates :exp_type, presence: true, inclusion: {in: EXP_TYPES}
  validates :year_start, numericality: { only_integer: true }, allow_nil: false
  validates :year_end, numericality: { only_integer: true }, allow_nil: true

  before_save :on_before_save


  def on_before_save
    ye = (self.year_end || "0").to_i
    ye = nil if ye == 0  # FE side
    self.year_end = ye
  end
end
