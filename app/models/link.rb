class Link < ApplicationRecord
  LINK_WEB = 0
  LINK_IN = 1
  LINK_GITHUB = 2
  LINK_DRIBBBLE = 3
  LINK_QUORA = 4
  LINK_FACEBOOK = 5
  LINK_TWITTER = 6
  LINK_ANGELIST = 7

  LINK_ALL = [
    [LINK_WEB, nil],
    [LINK_IN, 'linkedin.com/in'],
    [LINK_GITHUB, 'github.com'],
    [LINK_DRIBBBLE, 'dribbble.com'],
    [LINK_QUORA, 'quora.com'],
    [LINK_FACEBOOK, 'facebook.com',],
    [LINK_TWITTER, 'twitter.com'],
    [LINK_ANGELIST, 'angel.co']
  ]

  validates :url, presence: true
  validates :ltype, presence: true, inclusion: LINK_ALL.map{ |x| x[0] }

  before_save :pre_save

  def auto_ltype
    durl = self.url.downcase
    LINK_ALL.reverse.each { |item|
      return item[0] if item[1] && durl.include?(item[1])
    }
    return LINK_WEB
  end

  def pre_save
    self.ltype = auto_ltype
  end

  def self.rando_fakes(name)
    count = rand(LINK_ALL.length)
    links = []

    name = name.gsub(/\s/, '')

    all = LINK_ALL.shuffle

    (0...count).each do |pos|
      item = all[pos]
      if item[0] == LINK_WEB
        alink =  "http://#{name}.com"
      else
        alink = "http://#{all[pos][1]}/#{name}"
      end

      links << alink.downcase
    end

    links

  end
end
