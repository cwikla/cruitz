class Review < ApplicationRecord
  belongs_to :user
  belongs_to :from_user, :class_name => 'User'

  cache_notify :user
end
