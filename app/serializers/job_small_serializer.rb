class JobSmallSerializer < ActiveModel::Serializer
  attributes  :id,
              :title, 
							:description, 
							:time_commit, 
              :user_id,
              :created_at,
              :category,
              :salary,
              :salary_high,
              :salary_doe,
              :company

  has_one :company

  def category
    cat = object.categories.first
    #puts "CATEGORY"
    #puts "#{cat.inspect}"

    return nil if cat.nil?

    return CategorySerializer.new(cat)
  end

  def title
    Pyr::Base::Util::String::emojify(object.title)
  end

  def description
    Pyr::Base::Util::String::emojify(object.description)
  end

end
