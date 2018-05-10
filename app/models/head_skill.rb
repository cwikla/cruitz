class HeadSkill < ApplicationRecord
  belongs_to :head
  belongs_to :skill

  validates :head_id, presence: true
  validates :skill_id, presence: true
end
