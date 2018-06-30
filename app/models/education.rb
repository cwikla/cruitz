class Education < ApplicationRecord
  belongs_to :head

  validates :head, presence: true
  validates :place, presence: true
  validates :title, presence: true
  validates :year_start, numericality: { only_integer: true }, allow_nil: false
  validates :year_end, numericality: { only_integer: true }, allow_nil: true

  before_save :on_before_save



  def on_before_save
    ye = (self.year_end || "0").to_i
    ye = nil if ye == 0  # FE side
    self.year_end = ye
  end
end
