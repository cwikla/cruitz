class Rephone < ActiveRecord::Migration[5.1]
  def randing(c)
    s = ''
    (0...c).each do
      s = s + rand(10).to_s
    end
    s
  end

  def up
    Head.find_each do |h|
      h.email = h.email.split.join('')
      h.email.gsub!(/@cwikla.com/, '@cruitz.org')
      h.email.gsub!(/@cruitz.com/, '@cruitz.org')
      h.phone_number = randing(3) + '-555-' + randing(4);
      h.save!
    end
  end

  def down
    # nothing to see here
  end
end
