class AddDemoUploads < ActiveRecord::Migration[5.1]
  def up
    all = Upload.order("-id").limit(200)

    puts "MAX UPLOAD #{Upload.maximum(:id)}"

    Head.find_each do |h|
      puts "Head #{h.id}"
      (0...rand(3)).each do 
        up = all[rand(all.length-1)]
    
        np = Upload.new(
          bucket_name: up.bucket_name,
          file_name: up.file_name,
          content_type: up.content_type,
          sub_type: up.sub_type,
          user_id:  h.recruiter.id,
          uuid: up.uuid,
          path: up.path
        )
    
        np.save!
    
        HeadUpload.create!(upload: np, head: h)
      end
    end
  end

  def down
    # nothing to see here
  end
end
