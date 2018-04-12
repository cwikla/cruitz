class AddFakeRecruiterInfo < ActiveRecord::Migration[5.1]
  def up
    path = Rails.root.join('db', 'data', 'recruiters.txt')

    companies = []
    File.open(path).each do |x|
      companies << x.strip
    end
    
    gids = GeoName.select(:id).pluck(:id)
    
    count = 0
    User.is_recruiter.find_each do |x|
      if (x.first_name.downcase =~ /Recruiter-/) == 0
        x.first_name = x.first_name["Recruiter-".length, x.first_name.length]
        x.first_name.save!
      end
      x.company.name = companies[count]
      x.company.location = GeoName.find(gids[rand(gids.length+1)])
      count = count + 1
      puts x.company.location.inspect
      x.company.save!
    end
  end

  def down
    # nothing to see here
  end
end
