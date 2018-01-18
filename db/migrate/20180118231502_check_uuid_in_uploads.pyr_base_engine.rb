# This migration comes from pyr_base_engine (originally 20180118231355)
class CheckUuidInUploads < ActiveRecord::Migration[5.1]
  def up
    Upload.reset_column_information

    Upload.find_each do |x|
      x.check_uuid
      x.save
    end

  end

  def down
  end
end
