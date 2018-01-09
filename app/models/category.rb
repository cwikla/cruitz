class Category < ApplicationRecord
  has_many :job_categories
  has_many :jobs, through: :job_categories

  def self.categories_ids(clear = false)
    key = "allid"
    cache_fetch(key, force: clear) {
      Category.ids
    }
  end

  def self.categories(clear = false)
    self.find(categories_ids(clear))
  end
end
