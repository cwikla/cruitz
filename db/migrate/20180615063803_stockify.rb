class Stockify < ActiveRecord::Migration[5.1]
  def up
    max = 145

    count = 0
    User.is_recruiter.find_each do |u|
      count = count + 1
    
      pos = (u.id % ( max-1)) + 1
    
      upload = Upload.make(u, "#{pos}.jpg")
      upload.path = "stock"
    
      puts upload
    
      upload.save!
    
      puts upload.public_url
    
      u.logo = upload
      u.save!
    end
  end

  def down
  end
end
