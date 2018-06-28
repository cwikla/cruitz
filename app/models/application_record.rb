class ApplicationRecord < ActiveRecord::Base
  include Pyr::Base::SimpleCache
  include Pyr::Base::S3::ActsAsS3Asset
  include PgSearch

  self.abstract_class = true

  acts_as_simple_cache
  acts_as_paranoid

  #include Pyr::Base::UuidHelp
  #include Hashid


  class << self
    def pyr_search_scope(*args, **kwargs) 
      susing = kwargs[:using] ||  { tsearch: { any_word: true }}
      pg_search_scope(*args, **kwargs, using: susing)
    end
  end


  def self.ids
    select(:id).map(&:id).uniq
  end

  def self.hashid(hid)
    return hid
  end

  def self.dehashid(hid)
    return hid
  end

  def hashid
    return self.id
  end

  def s3_upload_col(col, options)
    puts "S3 upload col"
    super
  end

  def self.simple_search(name)
    where("lower(name) like ?", "%" + name.downcase + "%")
  end

  # HMMMMM - was having memory issues on Heroku, this seems to have fixed it
  # I really only use this for migration stuff, so should be groovy
  def self.find_each(**options) 
    stuff = (options || {}).dup
    stuff[:batch_size] ||= 100
    super(stuff)
  end

  def phone_number_on_before_save
    self.phone_number = self.phone_number.strip.scan(/\d/).join if !self.phone_number.blank?
  end

end
