class Category < ApplicationRecord
  has_many :job_categories
  has_many :jobs, through: :job_categories

  validates :name, presence: true

  acts_as_simple_cache :name

  def self.categories_ids(clear = false)
    key = "allid"
    cache_fetch(key, force: clear) {
      Category.ids
    }
  end

  def self.categories(clear = false)
    self.find(categories_ids(clear))
  end

  def self.get_category_by_name(names)
    Category.find_with_index(:name, names)
  end

end
