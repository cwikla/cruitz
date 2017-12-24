class Review < ApplicationRecord
  cached_belongs_to :user
  cached_belongs_to :from_user, :class_name => 'User'

  cache_notify :user
end
