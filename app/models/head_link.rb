class HeadLink < ApplicationRecord
  belongs_to :head
  belongs_to :link

  validates :head_id, presence: true
  validates :link_id, presence: true
end
